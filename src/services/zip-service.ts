import { getAppContext } from "@/contexts/AppContext";
import { debugLog } from "@/helpers";
import { FileData } from "@/types";
import { saveAs } from "file-saver";
import JSZip from "jszip";

class ZipService {
  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  public async exportProject(files: FileData[]): Promise<void> {
    const zipname = `${getAppContext()
      .projectName.toLocaleLowerCase()
      .replace(" ", "-")}.zip`;

    files.forEach((file) => {
      if (!file.isDirectory) {
        this.zip.file(file.path, file.content || "");
      }
    });

    const blob = await this.zip.generateAsync({ type: "blob" });
    debugLog(`[ZIP_SERVICE] Zip file created: ${zipname}`);
    saveAs(blob, zipname);
  }
}

export const zipService = new ZipService();
