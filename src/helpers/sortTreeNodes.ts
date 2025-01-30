import { TreeNode } from "primereact/treenode";

export default function sortTreeNodes(nodes: TreeNode[]) {
  nodes.sort((a, b) => {
    const aIsDir = a.data?.isDirectory;
    const bIsDir = b.data?.isDirectory;

    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;

    return (a.label ?? "").localeCompare(b.label ?? "");
  });

  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      sortTreeNodes(node.children);
    }
  }
}
