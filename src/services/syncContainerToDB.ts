import * as db from "@/services/db";
import { FileData } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { readAllFilesInContainer } from "./readAllFilesInContainer";

export async function syncContainerToDB() {
  const filesInContainer = await readAllFilesInContainer();
  const containerPaths = filesInContainer.map((f) => f.path);
  const filesInDB = await db.getAllFiles();

  // First sync directories to ensure parent folders exist
  for (const file of filesInContainer.filter((f) => f.isDirectory)) {
    const path = file.path.startsWith("/") ? file.path.slice(1) : file.path;
    const pathParts = path.split("/");
    const name = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, -1).join("/");

    // Find or create directory
    const dirFile = filesInDB.find((ef) => ef.path === path);

    if (!dirFile) {
      // Find parent directory's ID
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
      filesInDB.push(dirData); // Add to cache for next iterations
    }
  }

  // Then sync files with correct parent relationships
  for (const file of filesInContainer.filter((f) => !f.isDirectory)) {
    const path = file.path.startsWith("/") ? file.path.slice(1) : file.path;
    const pathParts = path.split("/");
    const name = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, -1).join("/");

    // Find parent directory's ID
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

  for (const file of filesInDB) {
    if (!containerPaths.includes(`/${file.path}`)) {
      await db.deleteFile(file.id);
    }
  }
}
