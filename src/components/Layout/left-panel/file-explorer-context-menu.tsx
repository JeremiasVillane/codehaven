import { getAppContext } from "@/contexts/AppContext";
import { getFileContext } from "@/contexts/FileContext";
import { deleteFile } from "@/services/db";
import { handleCreateClick } from "./file-explorer-handlers";
import { debugLog } from "@/helpers";

export const contextMenuItems = [
  {
    label: "New file",
    icon: "pi pi-file",
    command: () => handleCreateClick(false),
  },
  {
    label: "New folder",
    icon: "pi pi-folder",
    command: () => handleCreateClick(true),
  },
  {
    separator: true,
  },
  {
    label: "Delete",
    icon: "pi pi-trash",
    command: async () => {
      if (!getAppContext().selectedKey) return;
      try {
        await deleteFile(getAppContext().selectedKey);
        await getFileContext().loadFiles();
      } catch (err) {
        debugLog("Error deleting", err);
      }
    },
  },
];
