import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import * as db from "@/services/db";
import { FileData } from "@/types";
import { syncAllFilesToContainer } from "@/services/sync-all-files-to-container";
import {
  clearContainer,
  createFolder,
  deleteFileFromWebContainer,
  writeFile,
} from "@/services/webcontainer";
import { debugLog } from "@/helpers";

interface FileContextType {
  files: FileData[];
  currentFile: FileData | null;
  currentDirectory: string | null;
  importFiles: (files: FileList) => Promise<void>;
  createFile: (name: string, isDirectory: boolean) => Promise<void>;
  updateFileContent: (id: string, content: string) => Promise<void>;
  setCurrentFile: (file: FileData | null) => void;
  setCurrentDirectory: (dirId: string | null) => void;
  deleteFile: (id: string) => Promise<void>;
  getAllFiles: () => Promise<FileData[]>;
  loadFiles: () => Promise<void>;
  clearFiles: () => Promise<void>;
}

const FileContext = createContext<FileContextType | null>(null);
let externalContext: FileContextType | null = null;

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
};

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [currentDirectory, setCurrentDirectory] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      const allFiles = await db.getAllFiles();
      setFiles(allFiles);

      await syncAllFilesToContainer(allFiles);
    } catch (error) {
      debugLog("Error loading files:", error);
    }
  }, [currentDirectory]);

  useEffect(() => {
    loadFiles();
  }, [currentDirectory, loadFiles]);

  const createFile = async (name: string, isDirectory: boolean) => {
    const parentPath = currentDirectory
      ? (await db.getFile(currentDirectory))?.path || ""
      : "";

    const newPath = parentPath ? `${parentPath}/${name}` : name;
    const fileExtension = name.split(".").pop() || "";

    const newFile: FileData = {
      id: uuidv4(),
      name,
      content: "",
      path: newPath,
      type: fileExtension,
      parentId: currentDirectory || null,
      isDirectory,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.saveFile(newFile);
    await loadFiles();
  };

  const updateFileContent = async (id: string, content: string) => {
    const file = await db.getFile(id);
    if (file) {
      const updatedFile = {
        ...file,
        content,
        updatedAt: Date.now(),
      };
      await db.saveFile(updatedFile);
      if (currentFile?.id === id) {
        setCurrentFile(updatedFile);
      }
      await loadFiles();
    }
  };

  const deleteFile = async (id: string) => {
    const fileToDelete = await db.getFile(id);
    if (!fileToDelete) return;

    await db.deleteFile(id);
    await deleteFileFromWebContainer(fileToDelete.path);
    await loadFiles();

    if (currentFile?.id === id) {
      setCurrentFile(null);
    }
  };

  const getAllFiles = async () => {
    return db.getAllFiles();
  };

  const importFiles = async (files: FileList) => {
    try {
      const entries = Array.from(files);
      const processedFiles: FileData[] = [];

      // Get root folder name to skip it
      const rootFolder = entries[0].webkitRelativePath.split("/")[0];

      for (const file of entries) {
        // Skip the root folder itself
        if (file.webkitRelativePath === rootFolder) continue;

        // Remove root folder from path
        const fullPath = file.webkitRelativePath;
        const path = fullPath.substring(rootFolder.length + 1);

        // Skip if path is empty (means it was the root folder)
        if (!path) continue;

        const pathParts = path.split("/");
        const name = pathParts[pathParts.length - 1];

        // Create parent folders if needed
        let currentPath = "";
        for (const part of pathParts.slice(0, -1)) {
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          const dirExists = processedFiles.some((f) => f.path === currentPath);

          if (!dirExists) {
            processedFiles.push({
              id: uuidv4(),
              name: part,
              content: "",
              path: currentPath,
              type: "",
              parentId: null, // Will set later
              isDirectory: true,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        }

        // Add the file
        const content = await file.text();
        processedFiles.push({
          id: uuidv4(),
          name,
          content,
          path,
          type: name.split(".").pop() || "",
          parentId: null, // Will set later
          isDirectory: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      // Set parent IDs
      for (const file of processedFiles) {
        const pathParts = file.path.split("/");
        if (pathParts.length > 1) {
          const parentPath = pathParts.slice(0, -1).join("/");
          const parentFile = processedFiles.find((f) => f.path === parentPath);
          file.parentId = parentFile?.id || null;
        }
      }

      // Save to IndexedDB
      await db.clearAllFiles();
      for (const file of processedFiles) {
        await db.saveFile(file);
        // Also sync each file/folder to WebContainer
        if (file.isDirectory) {
          await createFolder(file.path);
        } else {
          await writeFile(file.path, file.content);
        }
      }

      await loadFiles();
    } catch (error) {
      debugLog("Error importing files:", error);
      throw error;
    }
  };

  const clearFiles = async () => {
    await db.clearAllFiles();
    await loadFiles();
    await clearContainer();
  };

  const value = {
    files,
    currentFile,
    currentDirectory,
    importFiles,
    createFile,
    updateFileContent,
    setCurrentFile,
    setCurrentDirectory,
    deleteFile,
    getAllFiles,
    loadFiles,
    clearFiles,
  };
  externalContext = value;

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export const getFileContext = () => {
  if (!externalContext) throw new Error("Context not initialized");
  return externalContext;
};
