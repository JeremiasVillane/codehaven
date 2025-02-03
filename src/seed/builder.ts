import { FileData } from "@/types";
import path from "path-browserify";
import { v4 as uuidv4 } from "uuid";

export default function flattenInitialFiles(
  obj: any,
  basePath = ""
): FileData[] {
  let result: FileData[] = [];
  for (const key in obj) {
    const fullPath = basePath ? path.join(basePath, key) : key;
    if (typeof obj[key] === "string") {
      result.push({
        id: uuidv4(),
        name: key,
        content: obj[key],
        path: fullPath,
        type: key.split(".").pop() || "",
        parentId: null,
        isDirectory: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else if (typeof obj[key] === "object") {
      result.push({
        id: uuidv4(),
        name: key,
        content: "",
        path: fullPath,
        type: "",
        parentId: null,
        isDirectory: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      result = result.concat(flattenInitialFiles(obj[key], fullPath));
    }
  }
  return result;
}
