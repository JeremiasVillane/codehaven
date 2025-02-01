import { CodeEditor } from "@/components/Layout/middle-panel";
import { FileData } from "@/types";
import { TabData } from "rc-dock";

export function getTab(file: FileData): TabData {
  return {
    id: file.id,
    content: <CodeEditor selectedFile={file} />,
    title: file.name,
    group: "editor",
    closable: true,
  };
}
