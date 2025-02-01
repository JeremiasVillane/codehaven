import { initWebcontainer, webcontainerInstance } from "./webcontainer";
import path from "path-browserify";

interface ContainerFile {
  path: string;
  content: string;
  isDirectory: boolean;
}

export async function readAllFilesInContainer(
  basePath = "/"
): Promise<ContainerFile[]> {
  const wc = await initWebcontainer();
  const results: ContainerFile[] = [];

  async function readDirRecursive(dirPath: string) {
    const entries = await (webcontainerInstance ?? wc).fs.readdir(dirPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        results.push({
          path: fullPath,
          content: "",
          isDirectory: true,
        });

        await readDirRecursive(fullPath);
      } else {
        const content = await (webcontainerInstance ?? wc).fs
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
