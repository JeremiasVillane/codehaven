import { debugLog } from "@/helpers";
import { getEditorSettings } from "@/layout/middle-panel/code-editor-helpers";
import { initializeProjectIfEmpty } from "@/seed/seeder";
import { dbService, syncService, webContainerService } from "@/services";
import { FileData } from "@/types";
import { compareObjectKeys } from "@/utils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

interface IFileContext {
  files: FileData[];
  currentFile: FileData | null;
  currentDirectory: string | null;
  importFiles: (files: FileList) => Promise<void>;
  createFile: (name: string, isDirectory: boolean) => Promise<void>;
  updateFile: (id: string, newData: Partial<FileData>) => Promise<void>;
  setCurrentFile: (file: FileData | null) => void;
  setCurrentDirectory: (dirId: string | null) => void;
  deleteFile: (id: string) => Promise<void>;
  getAllFiles: () => Promise<FileData[]>;
  loadFiles: () => Promise<void>;
  clearFiles: () => Promise<void>;
}

const FileContext = createContext<IFileContext | null>(null);
let externalContext: IFileContext | null = null;

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
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { autoLoadExample } = getEditorSettings();
        if (autoLoadExample === "on") await initializeProjectIfEmpty();
        await loadFiles();
      } catch (error) {
        debugLog("[FILE_PROVIDER] Error initializing project:", error);
      }
    })();
  }, [loadFiles]);

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

  const updateFile = async (id: string, newData: Partial<FileData>) => {
    const file = await dbService.getFile(id);
    if (!file) return;
    if (compareObjectKeys(file, newData)) return;

    if (file) {
      const updatedFile = {
        ...file,
        ...newData,
        updatedAt: Date.now(),
      };
      await dbService.saveFile(updatedFile);
      await webContainerService.writeFile(
        updatedFile.path,
        updatedFile.content
      );

      if (currentFile?.id === id) {
        setCurrentFile(updatedFile);
      }

      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === id ? updatedFile : f))
      );
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

        const fullPath = file.webkitRelativePath;
        // Remove root folder from path
        const relativePath = fullPath.substring(rootFolder.length + 1);
        if (!relativePath) continue;

        const pathParts = relativePath.split("/");
        const name = pathParts[pathParts.length - 1];

        // Create parent folders if needed
        let currentPath = "";
        for (const part of pathParts.slice(0, -1)) {
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          const dirExists = processedFiles.some(
            (f) => f.path === currentPath && f.isDirectory
          );

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
          path: relativePath,
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
          const parent = processedFiles.find(
            (f) => f.path === parentPath && f.isDirectory
          );
          file.parentId = parent ? parent.id : null;
        }
      }

      // Save to IndexedDB
      await dbService.clearAllFiles();
      for (const file of processedFiles) {
        await dbService.saveFile(file);
      }

      // Synchronize incrementally in the WebContainer:
      // 1. Create the folders (only if they are new).
      const createdFolders = new Set<string>();
      for (const file of processedFiles) {
        if (file.isDirectory && !createdFolders.has(file.path)) {
          await webContainerService.createFolder(file.path);
          createdFolders.add(file.path);
        }
      }
      // 2. Write the files with their contents
      for (const file of processedFiles) {
        if (!file.isDirectory) {
          await webContainerService.writeFile(file.path, file.content);
        }
      }

      // Finally, update the list of files in the context state.
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
    updateFile,
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
