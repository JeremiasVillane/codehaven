export interface FileData {
  id: string;
  name: string;
  content: string;
  path: string;
  type: string;
  parentId: string | null;
  isDirectory: boolean;
  createdAt: number;
  updatedAt: number;
}
