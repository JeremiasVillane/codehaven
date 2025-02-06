import { debugLog } from "@/helpers";
import { FileData } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { dbService } from "./db-service";
import { webContainerService } from "./webcontainer-service";

class SyncService {
  async syncContainerToDB(): Promise<void> {
    const filesInContainer = await webContainerService.readAllFiles();

    const IGNORED_PATHS = new Set([
      "node_modules",
      ".git",
      "dist",
      "build",
      ".cache",
      "coverage",
      ".DS_Store",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
    ]);

    // Function to normalize the path (removing the initial slash)
    const normalizePath = (p: string) => (p.startsWith("/") ? p.slice(1) : p);

    // Function to determine if a path (unnormalized) contains a segment to be ignored
    const isIgnoredPath = (p: string): boolean => {
      const normalized = normalizePath(p);
      const parts = normalized.split("/");
      return parts.some((part) => IGNORED_PATHS.has(part));
    };

    // Filter out files and directories that are not in IGNORED_PATHS
    const allowedFilesInContainer = filesInContainer.filter(
      (file) => !isIgnoredPath(file.path)
    );

    // We keep the original paths (with or without the slash) for use in the delete cycle,
    // as they are normalized in the following cycles.
    const containerPaths = allowedFilesInContainer.map((f) => f.path);

    const filesInDB = await dbService.getAllFiles();

    // Synchronize the directories first to make sure the parents exist
    const allowedDirectories = allowedFilesInContainer.filter(
      (f) => f.isDirectory
    );
    for (const file of allowedDirectories) {
      const pathNormalized = normalizePath(file.path);
      const pathParts = pathNormalized.split("/");
      const name = pathParts[pathParts.length - 1];
      const parentPath = pathParts.slice(0, -1).join("/");

      // Look for if the directory already exists in the database
      const dirFile = filesInDB.find(
        (ef: FileData) => ef.path === pathNormalized
      );

      if (!dirFile) {
        const parentDir = parentPath
          ? filesInDB.find((ef: FileData) => ef.path === parentPath)
          : null;
        const dirData: FileData = {
          id: uuidv4(),
          name,
          content: "",
          path: pathNormalized,
          type: "",
          parentId: parentDir?.id || null,
          isDirectory: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await dbService.saveFile(dirData);
        filesInDB.push(dirData); // Update the cache for the following iterations
      }
    }

    // Then we synchronize the files, establishing the relationship with the parent directory
    const allowedFiles = allowedFilesInContainer.filter((f) => !f.isDirectory);
    for (const file of allowedFiles) {
      const pathNormalized = normalizePath(file.path);
      const pathParts = pathNormalized.split("/");
      const name = pathParts[pathParts.length - 1];
      const parentPath = pathParts.slice(0, -1).join("/");
      const parentDir = parentPath
        ? filesInDB.find((ef: FileData) => ef.path === parentPath)
        : null;
      const existingFile = filesInDB.find(
        (ef: FileData) => ef.path === pathNormalized
      );

      if (existingFile) {
        if (existingFile.content !== file.content) {
          await dbService.saveFile({
            ...existingFile,
            content: file.content,
            parentId: parentDir?.id || null,
            updatedAt: Date.now(),
          });
        }
      } else {
        const fileData: FileData = {
          id: uuidv4(),
          name,
          content: file.content,
          path: pathNormalized,
          type: name.split(".").pop() || "",
          parentId: parentDir?.id || null,
          isDirectory: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await dbService.saveFile(fileData);
      }
    }

    // We remove from the database the files that are no longer in the container
    // (we use containerPaths filtering of ignored files)
    for (const file of filesInDB) {
      // As in the DB the normalized path is stored (without initial slash),
      // we add the slash to compare with the paths of the container
      if (!containerPaths.includes(`/${file.path}`)) {
        await dbService.deleteFile(file.id);
      }
    }

    debugLog("[SYNC_SERVICE] Sync container to DB completed.");
  }

  async syncAllFilesToContainer(files: FileData[]): Promise<void> {
    const folders = files.filter((f) => f.isDirectory);
    for (const folder of folders) {
      await webContainerService.createFolder(folder.path);
    }

    const regularFiles = files.filter((f) => !f.isDirectory);
    for (const file of regularFiles) {
      await webContainerService.writeFile(file.path, file.content);
    }

    debugLog("[SYNC_SERVICE] Sync all files to container completed.");
  }
}

export const syncService = new SyncService();
