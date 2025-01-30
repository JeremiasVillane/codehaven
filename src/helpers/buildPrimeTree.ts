import { FileData } from "@/types";
import { TreeNode } from "primereact/treenode";
import sortTreeNodes from "./sortTreeNodes";

export function buildPrimeTree(files: FileData[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const f of files) {
    nodeMap.set(f.id, {
      key: f.id,
      label: f.name,
      data: f,
      icon: f.isDirectory ? "pi pi-fw pi-folder" : "pi pi-fw pi-file",
      children: [],
    });
  }

  for (const f of files) {
    const childNode = nodeMap.get(f.id);
    if (f.parentId) {
      const parentNode = nodeMap.get(f.parentId);
      if (parentNode) {
        parentNode.children.push(childNode);
      }
    } else {
      roots.push(childNode);
    }
  }

  sortTreeNodes(roots);

  return roots;
}
