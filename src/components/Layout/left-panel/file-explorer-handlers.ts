import { getAppContext } from "@/contexts/AppContext";
import { getFileContext } from "@/contexts/FileContext";
import { debugLog, findNodeByKey, getTab } from "@/helpers";
import { FileData } from "@/types";
import { PanelData } from "rc-dock";

export const handleCreateClick = (folder: boolean) => {
  getAppContext().setIsCreating(true);
  getAppContext().setIsCreatingFolder(folder);
  getAppContext().setNewFileName("");
};

export const handleFileClick = (
  file: FileData & { isCreation?: boolean },
  isMobile: boolean
) => {
  if (file?.isCreation) return;

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

    getAppContext().dockLayout.dockMove(newTab, "editor", "middle");

    if (isMobile) getAppContext().setActivePanel("editor");
  }
};

export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Escape") {
    getAppContext().setIsCreating(false);
    getAppContext().setIsCreatingFolder(false);
    getAppContext().setNewFileName("");
  }

  if (e.key === "Enter") {
    handleSubmit(e);
  }
};

export const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const name = getAppContext().newFileName.trim();
  if (!name) {
    getAppContext().setIsCreating(false);
    return;
  }

  try {
    let parentIsDir = false;
    let parentId: string | null = null;

    if (getAppContext().selectedKey) {
      const node = findNodeByKey(
        getAppContext().nodes,
        getAppContext().selectedKey
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

    await getFileContext().createFile(name, getAppContext().isCreatingFolder);
    await getFileContext().loadFiles();
  } catch (error) {
    debugLog("[FILE_EXPLORER] Error creating element", error);
  } finally {
    getAppContext().setIsCreating(false);
    getAppContext().setNewFileName("");
  }
};

export const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
  const target = e.target as HTMLElement;
  if (target.getAttribute("data-pc-section") === "root") {
    getAppContext().setSelectedKey(null);
    getFileContext().setCurrentDirectory(null);
  }
};
