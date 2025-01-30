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
