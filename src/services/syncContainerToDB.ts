import * as db from "@/services/db";
import { FileData } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { readAllFilesInContainer } from "./readAllFilesInContainer";

export async function syncContainerToDB() {
  const filesInContainer = await readAllFilesInContainer();

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
  const normalizePath = (path: string) =>
    path.startsWith("/") ? path.slice(1) : path;

  // Function to determine if a path (unnormalized) contains a segment to be ignored
  const isIgnoredPath = (path: string): boolean => {
    const normalized = normalizePath(path);
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

  const filesInDB = await db.getAllFiles();

  // Synchronize the directories first to make sure the parents exist
  const allowedDirectories = allowedFilesInContainer.filter(
    (f) => f.isDirectory
  );
  for (const file of allowedDirectories) {
    // Normalize the path (we remove the initial slash)
    const path = normalizePath(file.path);
    const pathParts = path.split("/");
    const name = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, -1).join("/");

    // Look for if the directory already exists in the database
    const dirFile = filesInDB.find((ef) => ef.path === path);

    if (!dirFile) {
      // Look for the ID of the parent directory
      const parentDir = parentPath
        ? filesInDB.find((ef) => ef.path === parentPath)
        : null;

      const dirData: FileData = {
        id: uuidv4(),
        name,
        content: "",
        path,
        type: "",
        parentId: parentDir?.id || null,
        isDirectory: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.saveFile(dirData);
      filesInDB.push(dirData); // Update the cache for the following iterations
    }
  }

  // Then we synchronize the files, establishing the relationship with the parent directory
  const allowedFiles = allowedFilesInContainer.filter((f) => !f.isDirectory);
  for (const file of allowedFiles) {
    const path = normalizePath(file.path);
    const pathParts = path.split("/");
    const name = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, -1).join("/");

    // We look for the parent directory in the database
    const parentDir = parentPath
      ? filesInDB.find((ef) => ef.path === parentPath)
      : null;

    const existingFile = filesInDB.find((ef) => ef.path === path);

    if (existingFile) {
      if (existingFile.content !== file.content) {
        await db.saveFile({
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
        path,
        type: name.split(".").pop() || "",
        parentId: parentDir?.id || null,
        isDirectory: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.saveFile(fileData);
    }
  }

  // We remove from the database the files that are no longer in the container
  // (we use containerPaths filtering of ignored files)
  for (const file of filesInDB) {
    // As in the DB the normalized path is stored (without initial slash),
    // we add the slash to compare with the paths of the container
    if (!containerPaths.includes(`/${file.path}`)) {
      await db.deleteFile(file.id);
    }
  }
}
