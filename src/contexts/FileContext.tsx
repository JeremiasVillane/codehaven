import { debugLog } from "@/helpers";
import { dbService, syncService, webContainerService } from "@/services";
import { FileData } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

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
      const allFiles = await dbService.getAllFiles();
      setFiles(allFiles);

      await syncService.syncAllFilesToContainer(allFiles);
    } catch (error) {
      debugLog("[FILE_PROVIDER] Error loading files:", error);
    }
  }, [currentDirectory]);

  useEffect(() => {
    loadFiles();
  }, [currentDirectory, loadFiles]);

  const createFile = async (name: string, isDirectory: boolean) => {
    const parentPath = currentDirectory
      ? (await dbService.getFile(currentDirectory))?.path || ""
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

    await dbService.saveFile(newFile);
    await loadFiles();
  };

  const updateFileContent = async (id: string, content: string) => {
    const file = await dbService.getFile(id);
    if (file) {
      const updatedFile = {
        ...file,
        content,
        updatedAt: Date.now(),
      };
      await dbService.saveFile(updatedFile);
      if (currentFile?.id === id) {
        setCurrentFile(updatedFile);
      }
      await loadFiles();
    }
  };

  const deleteFile = async (id: string) => {
    const fileToDelete = await dbService.getFile(id);
    if (!fileToDelete) return;

    await dbService.deleteFile(id);
    await webContainerService.deleteFileFromWebContainer(fileToDelete.path);
    await loadFiles();

    if (currentFile?.id === id) {
      setCurrentFile(null);
    }
  };

  const getAllFiles = async () => {
    return dbService.getAllFiles();
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
      await dbService.clearAllFiles();
      for (const file of processedFiles) {
        await dbService.saveFile(file);
        // Also sync each file/folder to WebContainer
        if (file.isDirectory) {
          await webContainerService.createFolder(file.path);
        } else {
          await webContainerService.writeFile(file.path, file.content);
        }
      }

      await loadFiles();
    } catch (error) {
      debugLog("[FILE_PROVIDER] Error importing files:", error);
      throw error;
    }
  };

  const clearFiles = async () => {
    await dbService.clearAllFiles();
    await loadFiles();
    await webContainerService.clearContainer();
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
