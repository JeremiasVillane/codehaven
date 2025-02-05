import { getExplorerContext, getFileContext } from "@/contexts";
import { debugLog } from "@/helpers";
import { dbService } from "@/services";
import { handleCreateClick } from "./file-explorer-handlers";

export function getContextMenuItems() {
  const appCtx = getExplorerContext();
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
          await dbService.deleteFile(appCtx.selectedKey);
          await fileCtx.loadFiles();
        } catch (err) {
          debugLog("[FILE_EXPLORER] Error deleting", err);
        }
      },
    },
  ];
}
