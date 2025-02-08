import { getFileContext, getWebContainerContext } from "@/contexts";
import { addTerminal } from "@/layout/middle-panel/terminal-utils";
import { debugLog } from "./debug-log";
import { removeFilteredTabs } from "./remove-filtered-tabs";

export async function initializeProjectTerminals() {
  try {
    removeFilteredTabs("debug", "console");
    removeFilteredTabs("preview", "preview-blank");

    const setIsPopulated = getWebContainerContext().setIsPopulated;
    const files = await getFileContext().getAllFiles();

    if (files.length === 0) return;

    setIsPopulated(true);

    const packageFiles = files.filter(
      (file) => file.name === "package.json" && !file.isDirectory
    );

    if (packageFiles.length === 0) return;

    const terminalsToAdd = await Promise.all(
      packageFiles.map(async (file) => {
        try {
          const packageJson = JSON.parse(file.content);
          const scripts = packageJson.scripts || {};

          const startScript = scripts.dev || scripts.start;
          if (!startScript) return null;

          const dirPath = file.path.split("/").slice(0, -1).join("/");
          const cdCommand = dirPath ? `cd ./${dirPath}` : null;

          const commands = [
            cdCommand,
            "npm i",
            scripts.dev ? "npm run dev" : "npm start",
          ].filter(Boolean) as string[];

          return commands;
        } catch (err) {
          debugLog("[TERMINAL] Error parsing package.json:", err);
          return null;
        }
      })
    );

    const validTerminals = terminalsToAdd.filter(Boolean);

    if (validTerminals.length > 0) {
      window.dispatchEvent(new CustomEvent("seeding"));

      validTerminals.forEach((commands) => {
        addTerminal(commands);
      });
    }
  } catch (err) {
    debugLog("[TERMINAL] Error initializing project terminals:", err);
  }
}
