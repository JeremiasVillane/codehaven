import { getAppContext, getExplorerContext, getFileContext } from "@/contexts";
import {
  addTabToPanel,
  buildFileDataFromTree,
  debugLog,
  findNodeByKey,
  getTab,
  updatePaths,
} from "@/helpers";
import { dbService } from "@/services";
import { FileData } from "@/types";
import { TreeDragDropEvent } from "primereact/tree";
import { PanelData } from "rc-dock";

export const handleCreateClick = (folder: boolean) => {
  getExplorerContext().setIsCreating(true);
  getExplorerContext().setIsCreatingFolder(folder);
  getExplorerContext().setNewFileName("");
};

export const handleFileClick = (
  file: FileData & { isCreation?: boolean; isRenaming?: boolean },
  isMobile: boolean
) => {
  if (file?.isCreation || file?.isRenaming) return;

  if (file.isDirectory) {
    getFileContext().setCurrentDirectory(file.id);
  } else {
    getFileContext().setCurrentFile(file);

    const editorPanel = getAppContext().dockLayout.find("editor");
    if (!editorPanel) return;

    if ((editorPanel as PanelData).tabs.find((t) => t.id === file.id)) {
      getAppContext().dockLayout.updateTab(file.id, null, true);
      if (isMobile) getAppContext().setActivePanel("editor");
      return;
    }

    const newTab = getTab(file);

    if ((editorPanel as PanelData).tabs.find((t) => t.id === "editor-blank")) {
      getAppContext().dockLayout.updateTab("editor-blank", newTab, true);
    }

    addTabToPanel(newTab, "editor");

    if (isMobile) getAppContext().setActivePanel("editor");
  }
};

export const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const name = getExplorerContext().newFileName.trim();
  if (!name) {
    getExplorerContext().setIsCreating(false);
    return;
  }

  try {
    let parentIsDir = false;
    let parentId: string | null = null;

    if (getExplorerContext().selectedKey) {
      const node = findNodeByKey(
        getExplorerContext().nodes,
        getExplorerContext().selectedKey
      );
      const fileData = node?.data as FileData;
      if (fileData?.isDirectory) {
        parentIsDir = true;
        parentId = fileData.id;
      } else {
        parentId = fileData?.parentId || null;
      }
    }

    getFileContext().setCurrentDirectory(parentIsDir ? parentId : null);

    await getFileContext().createFile(
      name,
      getExplorerContext().isCreatingFolder
    );
    await getFileContext().loadFiles();
  } catch (error) {
    debugLog("[FILE_EXPLORER] Error creating element", error);
  } finally {
    getExplorerContext().setIsCreating(false);
    getExplorerContext().setNewFileName("");
  }
};

export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Escape") {
    getExplorerContext().setIsCreating(false);
    getExplorerContext().setIsCreatingFolder(false);
    getExplorerContext().setNewFileName("");
  }

  if (e.key === "Enter") {
    handleSubmit(e);
  }
};

export const handleRename = (
  newName: string,
  originalName: string,
  fileId: string,
  oldPath: string
) => {
  if (!newName || newName === originalName) return;

  const parts = oldPath.split("/");
  parts.pop();
  const newPath = parts.length ? parts.join("/") + "/" + newName : newName;
  getFileContext().updateFile(fileId, { name: newName, path: newPath });
};

export const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
  const target = e.target as HTMLElement;
  if (target.getAttribute("data-pc-section") === "root") {
    getExplorerContext().setSelectedKey(null);
    getFileContext().setCurrentDirectory(null);
  }
};

export const onDragDrop = async (event: TreeDragDropEvent) => {
  if (event.dropNode && !event.dropNode.data?.isDirectory) {
    return;
  }

  updatePaths(event.value);
  getExplorerContext().setNodes(event.value);

  const newFileData = buildFileDataFromTree(event.value);

  for (const file of newFileData) {
    if (!file.parentId) {
      file.parentId = null;
    }
    await dbService.saveFile(file);
  }
  await getFileContext().loadFiles();
};
