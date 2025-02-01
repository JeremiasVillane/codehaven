import { debugLog } from "@/helpers";
import { WebContainer } from "@webcontainer/api";

let webcontainerInstance: WebContainer | null = null;
let isInitialized = false;

export async function initWebcontainer(): Promise<WebContainer> {
  if (isInitialized) return;
  if (webcontainerInstance) {
    isInitialized = true;
    return webcontainerInstance;
  }
  try {
    webcontainerInstance = await WebContainer.boot();
    isInitialized = true;
    return webcontainerInstance;
  } catch (error) {
    debugLog("initWebcontainer error: ", error);
  }
}

export async function createFolder(path: string) {
  const wc = await initWebcontainer();
  await (webcontainerInstance ?? wc).fs.mkdir(path, { recursive: true });
}

export async function writeFile(path: string, content: string) {
  const wc = await initWebcontainer();
  const dir = path.substring(0, path.lastIndexOf("/"));

  if (dir) {
    await (webcontainerInstance ?? wc).fs
      .mkdir(dir, { recursive: true })
      .catch(() => {});
  }
  await (webcontainerInstance ?? wc).fs.writeFile(path, content);
}

export async function deleteFileFromWebContainer(path: string) {
  try {
    const wc = await initWebcontainer();
    await (webcontainerInstance ?? wc).fs.rm(path, { recursive: true });
    return true;
  } catch (error) {
    debugLog("Error deleting file from WebContainer:", error);
    throw error;
  }
}

export async function clearContainer() {
  try {
    const wc = await initWebcontainer();
    const rootDir = "/";
    const files = await (webcontainerInstance ?? wc).fs.readdir(rootDir);

    for (const file of files) {
      const filePath = `${rootDir}${file}`;
      await (webcontainerInstance ?? wc).fs.rm(filePath, { recursive: true });
    }
  } catch (error) {
    debugLog("Error clearing WebContainer:", error);
  }
}

export async function runCommand(command: string, args: string[] = []) {
  const wc = await initWebcontainer();
  return (webcontainerInstance ?? wc).spawn(command, args);
}

export async function onServerReady(
  callback: (port: number, url: string) => void
) {
  const wc = await initWebcontainer();

  (webcontainerInstance ?? wc).on("server-ready", (port, url) => {
    debugLog("WEBCONTAINER READY");
    callback(port, url);
  });
}

export { webcontainerInstance };
