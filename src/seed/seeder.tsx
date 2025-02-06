import { getAppContext, getWebContainerContext } from "@/contexts";
import { debugLog, getTerminalTab } from "@/helpers";
import { dbService, webContainerService } from "@/services";
import { TabData } from "rc-dock";
import flattenInitialFiles from "./builder";
import { initialFiles } from "./seed";
import { getEditorSettings } from "@/layout/middle-panel/code-editor-helpers";

export async function initializeProjectIfEmpty(): Promise<void> {
  try {
    const existingFiles = await dbService.getAllFiles();
    if (existingFiles.length === 0) {
      const { autoRunStartupScript } = getEditorSettings();

      debugLog(
        "[PROJECT INITIALIZER] IndexedDB is empty. Seeding initial files..."
      );

      if (autoRunStartupScript) {
        window.dispatchEvent(new CustomEvent("seeding"));
      }

      const filesToInsert = flattenInitialFiles(initialFiles);

      for (const file of filesToInsert) {
        const parts = file.path.split("/");
        if (parts.length > 1) {
          const parentPath = parts.slice(0, -1).join("/");
          const parent = filesToInsert.find(
            (f) => f.path === parentPath && f.isDirectory
          );
          file.parentId = parent ? parent.id : null;
        }
      }

      for (const file of filesToInsert) {
        await dbService.saveFile(file);
      }

      await webContainerService.clearContainer();

      const createdFolders = new Set<string>();
      for (const file of filesToInsert) {
        if (file.isDirectory && !createdFolders.has(file.path)) {
          await webContainerService.createFolder(file.path);
          createdFolders.add(file.path);
        }
      }

      for (const file of filesToInsert) {
        if (!file.isDirectory) {
          await webContainerService.writeFile(file.path, file.content);
        }
      }
      debugLog("[PROJECT INITIALIZER] Project initialized successfully.");
      getWebContainerContext().setIsPopulated(true);

      if (autoRunStartupScript) {
        const dockLayout = getAppContext().dockLayout;
        const terminals: TabData[] = ["server", "client"].map((folder, idx) =>
          getTerminalTab({
            id: `terminal${idx + 1}`,
            title: `Terminal ${idx + 1}`,
            commands: [`cd ./${folder}`, "npm i", "npm run dev"],
          })
        );

        terminals.map((t) => dockLayout.dockMove(t, "debug", "middle"));
      }
    } else {
      const dockLayout = getAppContext().dockLayout;
      dockLayout.dockMove(
        getTerminalTab({ id: "terminal1", title: "Terminal 1" }),
        "debug",
        "middle"
      );

      debugLog(
        "[PROJECT INITIALIZER] IndexedDB is not empty, initial seeding is skipped."
      );
    }
  } catch (error) {
    debugLog("[PROJECT INITIALIZER] Error initializing project:", error);
    throw error;
  }
}
