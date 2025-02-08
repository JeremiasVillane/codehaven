import { getExplorerContext, getFileContext } from "@/contexts";
import { debugLog } from "@/helpers";
import { dbService } from "@/services";
import { MenuItem } from "primereact/menuitem";
import { handleCreateClick } from "./file-explorer-handlers";

export function getContextMenuItems(): MenuItem[] {
  const explorerCtx = getExplorerContext();
  const fileCtx = getFileContext();
  const selectedKey = explorerCtx.selectedKey;
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
      label: "Rename",
      icon: "pi pi-pencil",
      command: async () => {
        const explorerCtx = getExplorerContext();
        if (!explorerCtx.selectedKey) return;
        try {
          explorerCtx.updateNode(explorerCtx.selectedKey, { isRenaming: true });
        } catch (err) {
          debugLog("[FILE_EXPLORER] Error renaming", err);
        }
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: async () => {
        if (!explorerCtx.selectedKey) return;
        try {
          await dbService.deleteFile(explorerCtx.selectedKey);
          await fileCtx.loadFiles();
        } catch (err) {
          debugLog("[FILE_EXPLORER] Error deleting", err);
        }
      },
    },
  ];
}
