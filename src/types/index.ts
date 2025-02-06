import { DBSchema } from "idb";

export type FileData = {
  id: string;
  name: string;
  content: string;
  path: string;
  type: string;
  parentId: string | null;
  isDirectory: boolean;
  createdAt: number;
  updatedAt: number;
};

export type PanelData = {
  id: string;
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
  header: React.ReactNode;
  content: React.ReactNode;
  subPanels?: PanelData[];
};

export type ContainerFile = {
  path: string;
  content: string;
  isDirectory: boolean;
};

export interface CodeHavenDB extends DBSchema {
  files: {
    key: string;
    value: FileData;
    indexes: { "by-parent": string };
  };
}

export type EditorSettings = {
  fontSize: number;
  lineHeight: number;
  wordWrap: "on" | "off";
  minimap: { enabled: boolean };
  persistStorage: "on" | "off";
  autoRunStartupScript: "on" | "off";
};
