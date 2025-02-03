import { debugLog } from "@/helpers";
import { WebContainer } from "@webcontainer/api";

import { ContainerFile } from "@/types";
import path from "path-browserify";

class WebContainerService {
  private static instance: WebContainerService;
  private webcontainer: WebContainer | null = null;
  private boot: Promise<WebContainer> | null = null;

  private constructor() {}

  static getInstance(): WebContainerService {
    if (!WebContainerService.instance) {
      WebContainerService.instance = new WebContainerService();
    }
    return WebContainerService.instance;
  }

  async init(): Promise<WebContainer> {
    if (this.webcontainer) return this.webcontainer;
    if (this.boot) return this.boot;

    this.boot = (async () => {
      try {
        debugLog("[WEBCONTAINER] Initializing service...");
        this.webcontainer = await WebContainer.boot();
        return this.webcontainer;
      } catch (error) {
        debugLog("[WEBCONTAINER] Boot error:", error);
        this.webcontainer = null;
        this.boot = null;
        throw error;
      }
    })();

    return this.boot;
  }

  async createFolder(path: string): Promise<void> {
    const wc = await this.init();
    try {
      await wc.fs.mkdir(path, { recursive: true });
      debugLog("[WEBCONTAINER] Folder created:", path);
    } catch (error) {
      debugLog("[WEBCONTAINER] Error creating folder:", error);
      throw error;
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    const wc = await this.init();
    const dir = path.substring(0, path.lastIndexOf("/"));
    if (dir) {
      try {
        await wc.fs.mkdir(dir, { recursive: true });
      } catch (error) {
        debugLog("[WEBCONTAINER] Error creating directory:", error);
      }
    }
    try {
      await wc.fs.writeFile(path, content);
      debugLog("[WEBCONTAINER] File written:", path);
    } catch (error) {
      debugLog("[WEBCONTAINER] Error writing file:", error);
      throw error;
    }
  }

  async deleteFileFromWebContainer(path: string): Promise<boolean> {
    const wc = await this.init();
    try {
      await wc.fs.rm(path, { recursive: true });
      debugLog("[WEBCONTAINER] File deleted:", path);
      return true;
    } catch (error) {
      debugLog("[WEBCONTAINER] Error deleting file:", error);
      throw error;
    }
  }

  async clearContainer(): Promise<void> {
    const wc = await this.init();
    try {
      const files = await wc.fs.readdir("/");
      for (const file of files) {
        const filePath = `/${file}`;
        await wc.fs.rm(filePath, { recursive: true });
      }
      debugLog("[WEBCONTAINER] Container cleared");
    } catch (error) {
      debugLog("[WEBCONTAINER] Error clearing container:", error);
      throw error;
    }
  }

  async runCommand(command: string, args: string[] = []): Promise<any> {
    const wc = await this.init();
    debugLog("[WEBCONTAINER] Running command:", command, args);
    return wc.spawn(command, args);
  }

  async onServerReady(
    callback: (port: number, url: string) => void
  ): Promise<void> {
    const wc = await this.init();
    wc.on("server-ready", (port: number, url: string) => {
      debugLog("[WEBCONTAINER] Server ready on port:", port, "url:", url);
      callback(port, url);
    });
  }

  async readAllFiles(basePath = "/"): Promise<ContainerFile[]> {
    const wc = await this.init();
    const results: ContainerFile[] = [];

    async function readDirRecursive(dirPath: string) {
      const entries = await wc.fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          results.push({ path: fullPath, content: "", isDirectory: true });
          await readDirRecursive(fullPath);
        } else {
          const content = await wc.fs
            .readFile(fullPath, "utf-8")
            .catch(() => "");
          results.push({
            path: fullPath,
            content: content || "",
            isDirectory: false,
          });
        }
      }
    }

    await readDirRecursive(basePath);
    return results;
  }
}

export const webContainerService = WebContainerService.getInstance();
