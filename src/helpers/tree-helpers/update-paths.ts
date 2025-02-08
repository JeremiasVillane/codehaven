import { TreeNode } from "primereact/treenode";

export function updatePaths(nodes: TreeNode[], parentPath: string = "") {
  for (const node of nodes) {
    if (!node.data?.isCreation) {
      const newPath =
        parentPath === "" ? `/${node.label}` : `${parentPath}/${node.label}`;
      if (node.data) {
        node.data.path = newPath;
      }
      if (node.children && node.children.length > 0) {
        updatePaths(node.children, newPath);
      }
    }
  }
}
