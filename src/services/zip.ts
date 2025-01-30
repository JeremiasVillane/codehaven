import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FileData } from "@/types";

export async function exportProject(files: FileData[]) {
  const zip = new JSZip();

  files.forEach((file) => {
    if (!file.isDirectory) {
      zip.file(file.path, file.content || "");
    }
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "project.zip");
}
