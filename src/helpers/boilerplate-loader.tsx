import { TEMPLATES } from "@/constants";
import {
  getAppContext,
  getFileContext,
  getWebContainerContext,
} from "@/contexts";
import { defaultLayout } from "@/layout";
import { addTerminal } from "@/layout/middle-panel/terminal-utils";
import flattenInitialFiles from "@/seed/builder";
import { dbService, webContainerService } from "@/services";
import { boilerplates } from "@/templates";
import { debugLog } from "./debug-log";

export async function boilerplateLoader(templateId: string) {
  try {
    const { template, commands } = boilerplates[templateId];

    if (!!commands && commands.length > 1) {
      console.log("dispatching...")
      window.dispatchEvent(new CustomEvent("seeding"));
    }

    getAppContext().dockLayout.loadLayout(defaultLayout);

    await dbService.clearAllFiles();

    const filesToInsert = flattenInitialFiles(template);

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

    debugLog(
      `[BOILERPLATE_LOADER] ${
        TEMPLATES.find((t) => t.id === templateId).title
      } template initialized successfully.`
    );
    getFileContext().loadFiles();
    getWebContainerContext().setIsPopulated(true);

    addTerminal(commands);
  } catch (error) {
    debugLog("Error loading boilerplate:", error);
    console.error(error);
  }
}
