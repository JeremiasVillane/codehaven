import { getAppContext } from "@/contexts/AppContext";
import { FileData } from "@/types";
import { saveAs } from "file-saver";
import JSZip from "jszip";

class ZipService {
  private zip: JSZip;
  private projectName: string;

  constructor() {
    this.zip = new JSZip();
    this.projectName = getAppContext()
      .projectName.toLocaleLowerCase()
      .replace(" ", "-");
  }

  public async exportProject(files: FileData[]): Promise<void> {
    files.forEach((file) => {
      if (!file.isDirectory) {
        this.zip.file(file.path, file.content || "");
      }
    });

    const blob = await this.zip.generateAsync({ type: "blob" });
    saveAs(blob, `${this.projectName}.zip`);
  }
}

export const zipService = new ZipService();
