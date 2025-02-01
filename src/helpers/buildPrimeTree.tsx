import NewFileForm from "@/components/Layout/left-panel/new-file-form";
import { getAppContext } from "@/contexts/AppContext";
import { getFileContext } from "@/contexts/FileContext";
import { FileData } from "@/types";
import { TreeNode } from "primereact/treenode";
import sortTreeNodes from "./sortTreeNodes";

export function buildPrimeTree(files: FileData[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];
  const { currentDirectory } = getFileContext();
  const { isCreating, isCreatingFolder } = getAppContext();

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

  if (isCreating || isCreatingFolder) {
    if (currentDirectory) {
      const parentNode = nodeMap.get(currentDirectory);
      if (parentNode && parentNode.data.isDirectory) {
        parentNode.children.unshift({
          key: `${currentDirectory}-new`,
          label: "",
          data: {
            isCreation: true,
            creationElement: <NewFileForm />,
          },
          leaf: true,
          selectable: false,
        });
      }
    } else {
      roots.unshift({
        key: "root-new",
        label: "",
        data: {
          isCreation: true,
          creationElement: <NewFileForm />,
        },
        leaf: true,
        selectable: false,
      });
    }
  }

  sortTreeNodes(roots);
  return roots;
}
