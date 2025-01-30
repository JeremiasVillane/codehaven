import { getAppContext } from "@/contexts/AppContext";
import { getFileContext } from "@/contexts/FileContext";
import { findNodeByKey } from "@/helpers";
import { FileData } from "@/types";

export const handleCreateClick = (folder: boolean) => {
  getAppContext().setIsCreating(true);
  getAppContext().setIsCreatingFolder(folder);
  getAppContext().setNewFileName("");
};

export const handleFileClick = (file: FileData) => {
  if (file.isDirectory) {
    getFileContext().setCurrentDirectory(file.id);
  } else {
    getFileContext().setCurrentFile(file);
  }
};

export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Escape") {
    getAppContext().setIsCreating(false);
    getAppContext().setNewFileName("");
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
    console.error("Error creating element", error);
  } finally {
    getAppContext().setIsCreating(false);
    getAppContext().setNewFileName("");
  }
};
