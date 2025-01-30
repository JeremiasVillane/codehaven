import { FileData } from "@/types";
import { createFolder, writeFile } from "./webcontainer";

export async function syncAllFilesToContainer(files: FileData[]) {
  const folders = files.filter((f) => f.isDirectory);
  for (const folder of folders) {
    await createFolder(folder.path);
  }

  const regularFiles = files.filter((f) => !f.isDirectory);
  for (const file of regularFiles) {
    await writeFile(file.path, file.content);
  }

  // const packageJson = {
  //   name: "my-webcontainer-project",
  //   version: "1.0.0",
  //   scripts: {
  //     dev: "vite",
  //   },
  //   dependencies: {
  //     react: "latest",
  //     "react-dom": "latest",
  //     vite: "latest",
  //   },
  // };
  // await writeFile("package.json", JSON.stringify(packageJson, null, 2));
}
