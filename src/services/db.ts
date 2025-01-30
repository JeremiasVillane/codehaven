import { openDB, DBSchema } from "idb";
import { FileData } from "@/types";

interface MyDB extends DBSchema {
  files: {
    key: string;
    value: FileData;
    indexes: { "by-parent": string };
  };
}

const DB_NAME = "codehaven";
const DB_VERSION = 1;

export const initDB = async () => {
  const db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore("files", { keyPath: "id" });
      store.createIndex("by-parent", "parentId");
    },
  });
  return db;
};

export const getFilesByParent = async (parentId: string | null) => {
  const db = await initDB();
  return db.getAllFromIndex("files", "by-parent", parentId);
};

export const getFile = async (id: string) => {
  const db = await initDB();
  return db.get("files", id);
};

export const getAllFiles = async () => {
  const db = await initDB();
  return db.getAll("files");
};

export const saveFile = async (file: FileData) => {
  const db = await initDB();
  await db.put("files", file);
};

export const deleteFile = async (id: string) => {
  const db = await initDB();
  await db.delete("files", id);
};

export const clearAllFiles = async () => {
  const db = await initDB();
  const tx = db.transaction("files", "readwrite");
  const store = tx.objectStore("files");
  await store.clear();
  await tx.done;
};
