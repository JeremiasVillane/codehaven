import { debugLog } from "@/helpers";
import { getEditorSettings } from "@/layout/middle-panel/code-editor-helpers";
import { initializeProjectIfEmpty } from "@/seed/seeder";
import { dbService } from "@/services/db-service";
import { syncService } from "@/services/sync-service";
import { webContainerService } from "@/services/webcontainer-service";
import { FileData } from "@/types";
import { compareObjectKeys } from "@/utils";
import { useSpace } from "@ably/spaces/react";
import React, {
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

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [currentDirectory, setCurrentDirectory] = useState<string | null>(null);

  const { space } = useSpace();

  const [usePersistence, setUsePersistence] = useState<boolean>(() => {
    const initSettings = getEditorSettings();
    const paramRoom = new URLSearchParams(window.location.search).get("room");
    if (paramRoom) return false;

    return initSettings.persistStorage === "on";
  });

  useEffect(() => {
    function handlePersistChange(e: CustomEvent<{ persistStorage: string }>) {
      const { persistStorage } = e.detail;
      const paramRoom = new URLSearchParams(window.location.search).get("room");
      if (paramRoom) {
        setUsePersistence(false);
      } else {
        setUsePersistence(persistStorage === "on");
      }
    }
    window.addEventListener(
      "persistStorageChange",
      handlePersistChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "persistStorageChange",
        handlePersistChange as EventListener
      );
    };
  }, []);

  const loadFiles = useCallback(async () => {
    if (!usePersistence) {
      if (files.length > 0) {
        debugLog(
          "[FILE_PROVIDER] Already have files in memory, skipping container read"
        );
        return;
      }

      const containerFiles = await webContainerService.readAllFiles("/");
      const loaded = containerFiles.map((cf) => ({
        id: cf.path.replace(/^\/+/, ""),
        name: cf.path.split("/").pop() || "",
        content: cf.content,
        path: cf.path.replace(/^\/+/, ""),
        type: cf.path.split(".").pop() || "",
        parentId: null,
        isDirectory: cf.isDirectory,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      setFiles(loaded);
    } else {
      try {
        const allFiles = await dbService.getAllFiles();
        setFiles(allFiles);
        await syncService.syncAllFilesToContainer(allFiles);
      } catch (error) {
        debugLog("[FILE_CONTEXT] Error loading files:", error);
      }
    }
  }, [usePersistence, files]);

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
  }, [loadFiles]); // []

  const createFile = async (name: string, isDirectory: boolean) => {
    const parentPath = currentDirectory
      ? (usePersistence && (await dbService.getFile(currentDirectory)))?.path ||
        ""
      : "";
    const newPath = parentPath ? `${parentPath}/${name}` : name;
    const fileExtension = name.split(".").pop() || "";
    const newId = newPath.replace(/^\/+/, "") || uuidv4();

    const newFile: FileData = {
      id: newId,
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
    }
    if (isDirectory) {
      await webContainerService.createFolder(newPath);
    } else {
      await webContainerService.writeFile(newPath, "");
    }

    setFiles((prev) => [...prev, newFile]);
  };

  const updateFile = async (id: string, newData: Partial<FileData>) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;
    if (compareObjectKeys(file, newData)) return;

    const updatedFile = { ...file, ...newData, updatedAt: Date.now() };

    if (usePersistence) {
      await dbService.saveFile(updatedFile);
    }
    await webContainerService.writeFile(updatedFile.path, updatedFile.content);

    if (currentFile?.id === id) setCurrentFile(updatedFile);
    setFiles((prev) => prev.map((f) => (f.id === id ? updatedFile : f)));
  };

  const deleteFile = async (id: string) => {
    const fileToDelete = files.find((f) => f.id === id);
    if (!fileToDelete) return;
    if (usePersistence) {
      await dbService.deleteFile(id);
    }
    await webContainerService.deleteFileFromWebContainer(fileToDelete.path);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (currentFile?.id === id) setCurrentFile(null);
  };

  const importFiles = async (fileList: FileList) => {
    try {
      const entries = Array.from(fileList);
      const processedFiles: FileData[] = [];
      const rootFolder = entries[0].webkitRelativePath.split("/")[0];

      for (const file of entries) {
        if (file.webkitRelativePath === rootFolder) continue;
        const fullPath = file.webkitRelativePath;
        const relativePath = fullPath.substring(rootFolder.length + 1);
        if (!relativePath) continue;

        const pathParts = relativePath.split("/");
        const name = pathParts[pathParts.length - 1];

        let currentPath = "";
        for (const part of pathParts.slice(0, -1)) {
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          const dirExists = processedFiles.some(
            (f) => f.path === currentPath && f.isDirectory
          );

          if (!dirExists) {
            processedFiles.push({
              id: currentPath || uuidv4(),
              name: part,
              content: "",
              path: currentPath,
              type: "",
              parentId: null,
              isDirectory: true,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        }

        const content = await file.text();
        processedFiles.push({
          id: relativePath || uuidv4(),
          name,
          content,
          path: relativePath,
          type: name.split(".").pop() || "",
          parentId: null,
          isDirectory: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      if (usePersistence) {
        await dbService.clearAllFiles();
        for (const file of processedFiles) {
          await dbService.saveFile(file);
        }
      }

      const createdFolders = new Set<string>();
      for (const file of processedFiles) {
        if (file.isDirectory && !createdFolders.has(file.path)) {
          await webContainerService.createFolder(file.path);
          createdFolders.add(file.path);
        }
      }
      for (const file of processedFiles) {
        if (!file.isDirectory) {
          await webContainerService.writeFile(file.path, file.content);
        }
      }

      setFiles(processedFiles);
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
    setFiles([]);
    setCurrentFile(null);
  };

  const handleFullSync = useCallback(
    async (received: FileData[]) => {
      if (usePersistence) {
        await dbService.clearAllFiles();
      }
      await webContainerService.clearContainer();

      for (const rf of received) {
        if (usePersistence) {
          await dbService.saveFile(rf);
        }
        if (rf.isDirectory) {
          await webContainerService.createFolder(rf.path);
        } else {
          await webContainerService.writeFile(rf.path, rf.content);
        }
      }
      setFiles(received);
    },
    [usePersistence]
  );

  useEffect(() => {
    if (!space?.channel) return;

    const handler = (msg: any) => {
      const { name, data } = msg;
      if (!space?.client?.clientId) return;
      const myClientId = space.client.clientId;

      if (name === "requestFullSync") {
        const { senderId } = data;
        if (senderId !== myClientId && files.length > 0) {
          space.channel.publish("fullSync", {
            senderId: myClientId,
            files,
          });
        }
      } else if (name === "fullSync") {
        const { senderId, files: remoteFiles } = data;
        if (senderId !== myClientId) {
          handleFullSync(remoteFiles);
        }
      } else if (name === "fileUpdate") {
        const { senderId, fileId, content } = data;
        if (senderId !== myClientId) {
          updateFile(fileId, { content });
        }
      }
    };

    space.channel.subscribe(handler);
    return () => {
      space.channel.unsubscribe(handler);
    };
  }, [space, files, handleFullSync, updateFile]);

  useEffect(() => {
    if (!space?.channel) return;
    if (files.length === 0 && space.client?.clientId) {
      space.channel.publish("requestFullSync", {
        senderId: space.client.clientId,
      });
    }
  }, [space, files]);

  const sendFileUpdate = (fileId: string, content: string) => {
    if (!space?.channel || !space.client?.clientId) return;
    space.channel.publish("fileUpdate", {
      senderId: space.client.clientId,
      fileId,
      content,
    });
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
    getAllFiles: async () => files,
    loadFiles,
    clearFiles,
    sendFileUpdate,
  };
  externalContext = value;

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export const getFileContext = () => {
  if (!externalContext) throw new Error("Context not initialized");
  return externalContext;
};
