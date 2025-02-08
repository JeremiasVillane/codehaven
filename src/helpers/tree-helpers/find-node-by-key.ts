import { TreeNode } from "primereact/treenode";

export function findNodeByKey(
  treeNodes: TreeNode[],
  key: string
): TreeNode | null {
  for (const node of treeNodes) {
    if (node.key === key) return node;
    if (node.children) {
      const found = findNodeByKey(node.children, key);
      if (found) return found;
    }
  }
  return null;
}
