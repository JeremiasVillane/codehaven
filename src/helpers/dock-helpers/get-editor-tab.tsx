import { CodeEditor } from "@/layout/middle-panel";
import { FileData } from "@/types";
import { TabData } from "rc-dock";

export function getEditorTab(file: FileData): TabData {
  return {
    id: file.id,
    content: <CodeEditor selectedFile={file} />,
    title: file.name,
    group: "editor",
    closable: true,
  };
}
