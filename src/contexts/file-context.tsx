import { debugLog } from "@/helpers";
import { getEditorSettings } from "@/layout/middle-panel/code-editor-helpers";
import { initializeProjectIfEmpty } from "@/seed/seeder";
import { dbService, syncService, webContainerService } from "@/services";
import { FileData } from "@/types";
import { compareObjectKeys } from "@/utils";
import { useChannel } from "ably/react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  localClientId: string;
  sendFileUpdate: (fileId: string, content: string) => void;
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

export const FileProvider: React.FC<{
  children: React.ReactNode;
  room: string;
}> = ({ children, room }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [currentDirectory, setCurrentDirectory] = useState<string | null>(null);
  const localClientId = useRef(uuidv4()).current;

  const [usePersistence, setUsePersistence] = useState<boolean>(() => {
    const initSettings = getEditorSettings();
    const paramRoom = new URLSearchParams(window.location.search).get("room");
    if (paramRoom) return false;

    return initSettings.persistStorage === "on";
  });

  useEffect(() => {
    function handlePersistChange(e: any) {
      const { persistStorage } = e.detail;
      const paramRoom = new URLSearchParams(window.location.search).get("room");
      if (paramRoom) {
        setUsePersistence(false);
      } else {
        setUsePersistence(persistStorage === "on");
      }
    }
    window.addEventListener("persistStorageChange", handlePersistChange);
    return () => {
      window.removeEventListener("persistStorageChange", handlePersistChange);
    };
  }, []);

  const loadFiles = useCallback(async () => {
    if (!usePersistence) {
      const containerFiles = await webContainerService.readAllFiles("/");
      debugLog(
        "[FILE_PROVIDER] readAllFiles from container only",
        containerFiles.length
      );
      setFiles(
        containerFiles.map((cf) => ({
          id: uuidv4(),
          name: cf.path.split("/").pop() || "",
          content: cf.content,
          path: cf.path.replace(/^\/+/, ""),
          type: cf.path.split(".").pop() || "",
          parentId: null,
          isDirectory: cf.isDirectory,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }))
      );
    } else {
      try {
        const allFiles = await dbService.getAllFiles();
        setFiles(allFiles);

        await syncService.syncAllFilesToContainer(allFiles);
      } catch (error) {
        debugLog("[FILE_PROVIDER] Error loading files:", error);
      }
    }
  }, [usePersistence]);

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
      ? (usePersistence && (await dbService.getFile(currentDirectory)))?.path ||
        ""
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

    if (usePersistence) {
      await dbService.saveFile(newFile);
      await loadFiles();
    } else {
      if (isDirectory) {
        await webContainerService.createFolder(newPath);
      } else {
        await webContainerService.writeFile(newPath, "");
      }

      await loadFiles();
    }
  };

  const updateFile = async (id: string, newData: Partial<FileData>) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;
    if (compareObjectKeys(file, newData)) return;

    const updatedFile = { ...file, ...newData, updatedAt: Date.now() };

    if (usePersistence) await dbService.saveFile(updatedFile);
    await webContainerService.writeFile(updatedFile.path, updatedFile.content);

    if (currentFile?.id === id) setCurrentFile(updatedFile);
    setFiles((prev) => prev.map((f) => (f.id === id ? updatedFile : f)));
  };

  const deleteFile = async (id: string) => {
    const fileToDelete = files.find((f) => f.id === id);
    if (!fileToDelete) return;

    if (usePersistence) await dbService.deleteFile(id);

    await webContainerService.deleteFileFromWebContainer(fileToDelete.path);
    await loadFiles();
    if (currentFile?.id === id) setCurrentFile(null);
  };

  const getAllFiles = async () => {
    if (!usePersistence) {
      const containerFiles = await webContainerService.readAllFiles("/");
      return containerFiles.map((cf) => ({
        id: uuidv4(),
        name: cf.path.split("/").pop() || "",
        content: cf.content,
        path: cf.path.replace(/^\/+/, ""),
        type: cf.path.split(".").pop() || "",
        parentId: null,
        isDirectory: cf.isDirectory,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
    } else {
      return dbService.getAllFiles();
    }
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
      if (usePersistence) {
        await dbService.clearAllFiles();
        for (const file of processedFiles) {
          await dbService.saveFile(file);
        }
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
    if (usePersistence) {
      await dbService.clearAllFiles();
    }
    await webContainerService.clearContainer();
    await loadFiles();
  };

  const { channel } = useChannel(`project-${room}`, (msg) => {
    if (msg.name === "fileUpdate") {
      const { senderId, fileId, content } = msg.data;
      if (senderId !== localClientId) {
        updateFile(fileId, { content });
      }
    }
    if (msg.name === "requestFullSync") {
      const { senderId } = msg.data;
      if (senderId === localClientId) return;
      if (files.length > 0) {
        channel.publish("fullSync", {
          senderId: localClientId,
          files: files.map((f) => ({
            id: f.id,
            name: f.name,
            content: f.content,
            path: f.path,
            type: f.type,
            parentId: f.parentId,
            isDirectory: f.isDirectory,
          })),
        });
      }
    }
    if (msg.name === "fullSync") {
      const { senderId, files: remoteFiles } = msg.data;
      if (senderId !== localClientId) {
        handleFullSync(remoteFiles);
      }
    }
  });

  const handleFullSync = useCallback(
    async (received: Partial<FileData>[]) => {
      if (usePersistence) {
        await dbService.clearAllFiles();
      }
      await webContainerService.clearContainer();

      for (const rf of received) {
        const newFile: FileData = {
          id: rf.id!,
          name: rf.name || "",
          content: rf.content || "",
          path: rf.path || "",
          type: rf.type || "",
          parentId: rf.parentId || null,
          isDirectory: !!rf.isDirectory,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        if (usePersistence) {
          await dbService.saveFile(newFile);
        }
        if (newFile.isDirectory) {
          await webContainerService.createFolder(newFile.path);
        } else {
          await webContainerService.writeFile(newFile.path, newFile.content);
        }
      }
      await loadFiles();
    },
    [usePersistence, loadFiles]
  );

  useEffect(() => {
    if (!room) return;
    if (files.length === 0) {
      channel.publish("requestFullSync", { senderId: localClientId });
    }
  }, [room, files, channel, localClientId]);

  const sendFileUpdate = (fileId: string, content: string) => {
    channel.publish("fileUpdate", { senderId: localClientId, fileId, content });
  };

  const value: IFileContext = {
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
    localClientId,
    sendFileUpdate,
  };
  externalContext = value;

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export const getFileContext = () => {
  if (!externalContext) throw new Error("Context not initialized");
  return externalContext;
};
