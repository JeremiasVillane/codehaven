import { DB_NAME, DB_VERSION } from "@/constants";
import { debugLog } from "@/helpers";
import { CodeHavenDB, FileData } from "@/types";
import { IDBPDatabase, openDB } from "idb";

class DBService {
  private static instance: DBService;
  private db: IDBPDatabase<CodeHavenDB> | null = null;

  private constructor() {}

  static getInstance(): DBService {
    if (!DBService.instance) {
      DBService.instance = new DBService();
    }
    return DBService.instance;
  }

  async init(): Promise<IDBPDatabase<CodeHavenDB>> {
    if (this.db) return this.db;

    this.db = await openDB<CodeHavenDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("files", { keyPath: "id" });
        store.createIndex("by-parent", "parentId");
        debugLog("[INDEXED_DB] Database initialized");
      },
    });

    return this.db;
  }

  async getFilesByParent(parentId: string | null) {
    const db = await this.init();
    if (!db) return [];
    return db.getAllFromIndex("files", "by-parent", parentId);
  }

  async getFile(id: string) {
    const db = await this.init();
    if (!db) return;
    return db.get("files", id);
  }

  async getAllFiles() {
    const db = await this.init();
    if (!db) return [];
    return db.getAll("files");
  }

  async saveFile(file: FileData) {
    const db = await this.init();
    if (!db) return;
    await db.put("files", file);
  }

  async deleteFile(id: string) {
    const db = await this.init();
    if (!db) return;
    await db.delete("files", id);
  }

  async clearAllFiles() {
    const db = await this.init();
    if (!db) return;
    const tx = db.transaction("files", "readwrite");
    await tx.objectStore("files").clear();
    await tx.done;
  }
}

export const dbService = DBService.getInstance();
