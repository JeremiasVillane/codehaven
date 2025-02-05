import { FileData } from "@/types";
import { TreeNode } from "primereact/treenode";

export function buildFileDataFromTree(nodes: TreeNode[]): FileData[] {
  const files: FileData[] = [];

  function traverse(node: TreeNode, parentId?: string) {
    if (node.data?.isCreation) return;

    const file: FileData = {
      ...node.data,
      id: node.key,
      parentId: parentId,
      name: node.label,
    };

    files.push(file);

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        traverse(child, file.id);
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }

  return files;
}
