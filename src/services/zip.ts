import { getAppContext } from "@/contexts/AppContext";
import { FileData } from "@/types";
import { saveAs } from "file-saver";
import JSZip from "jszip";

export async function exportProject(files: FileData[]) {
  const zip = new JSZip();
  const projectName = getAppContext()
    .projectName.toLocaleLowerCase()
    .replace(" ", "-");

  files.forEach((file) => {
    if (!file.isDirectory) {
      zip.file(file.path, file.content || "");
    }
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${projectName}.zip`);
}
