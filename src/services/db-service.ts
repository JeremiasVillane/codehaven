import { openDB, DBSchema, IDBPDatabase } from "idb";
import { FileData } from "@/types";
import { debugLog } from "@/helpers";

interface MyDB extends DBSchema {
  files: {
    key: string;
    value: FileData;
    indexes: { "by-parent": string };
  };
}

const DB_NAME = "codehaven";
const DB_VERSION = 1;

class DBService {
  private static instance: DBService;
  private db: IDBPDatabase<MyDB> | null = null;

  private constructor() {}

  static getInstance(): DBService {
    if (!DBService.instance) {
      DBService.instance = new DBService();
    }
    return DBService.instance;
  }

  async init(): Promise<IDBPDatabase<MyDB>> {
    if (this.db) return this.db;

    this.db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("files", { keyPath: "id" });
        store.createIndex("by-parent", "parentId");
        debugLog("[INDEXED_DB] Database initialized")
      },
    });

    return this.db;
  }

  async getFilesByParent(parentId: string | null) {
    const db = await this.init();
    return db.getAllFromIndex("files", "by-parent", parentId);
  }

  async getFile(id: string) {
    const db = await this.init();
    return db.get("files", id);
  }

  async getAllFiles() {
    const db = await this.init();
    return db.getAll("files");
  }

  async saveFile(file: FileData) {
    const db = await this.init();
    await db.put("files", file);
  }

  async deleteFile(id: string) {
    const db = await this.init();
    await db.delete("files", id);
  }

  async clearAllFiles() {
    const db = await this.init();
    const tx = db.transaction("files", "readwrite");
    await tx.objectStore("files").clear();
    await tx.done;
  }
}

export const dbService = DBService.getInstance();
