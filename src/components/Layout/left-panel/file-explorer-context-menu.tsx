import { getAppContext } from "@/contexts/AppContext";
import { getFileContext } from "@/contexts/FileContext";
import { deleteFile } from "@/services/db";
import { handleCreateClick } from "./file-explorer-handlers";
import { debugLog } from "@/helpers";

export function getContextMenuItems() {
  const appCtx = getAppContext();
  const fileCtx = getFileContext();
  const selectedKey = appCtx.selectedKey;
  const selectedFile = fileCtx.files.find((f) => f.id === selectedKey);

  return [
    ...(selectedFile && selectedFile.isDirectory
      ? [
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
        ]
      : []),
    { separator: true },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: async () => {
        if (!appCtx.selectedKey) return;
        try {
          await deleteFile(appCtx.selectedKey);
          await fileCtx.loadFiles();
        } catch (err) {
          debugLog("Error deleting", err);
        }
      },
    },
  ];
}
