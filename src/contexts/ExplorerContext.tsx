import { Menu } from "primereact/menu";
import { TreeNode } from "primereact/treenode";
import React, { createContext, useContext, useRef, useState } from "react";

interface IExplorerContext {
  menuRef: React.RefObject<Menu>;
  nodes: TreeNode[];
  setNodes: (nodes: TreeNode[]) => void;
  expandedKeys: { [key: string]: boolean };
  setExpandedKeys: (keys: { [key: string]: boolean }) => void;
  selectedKey: string | null;
  setSelectedKey: (key: string | null) => void;
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
  isCreatingFolder: boolean;
  setIsCreatingFolder: (isCreatingFolder: boolean) => void;
  newFileName: string;
  setNewFileName: (name: string) => void;
}

const ExplorerContext = createContext<IExplorerContext | null>(null);
let externalContext: IExplorerContext | null = null;

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  if (!context) {
    throw new Error("useExplorer must be used within a FileProvider");
  }
  return context;
};

export const ExplorerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const menuRef = useRef<Menu>(null);

  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const value = {
    menuRef,
    nodes,
    setNodes,
    expandedKeys,
    setExpandedKeys,
    selectedKey,
    setSelectedKey,
    isCreating,
    setIsCreating,
    isCreatingFolder,
    setIsCreatingFolder,
    newFileName,
    setNewFileName,
  };
  externalContext = value;

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
};

export const getExplorerContext = () => {
  if (!externalContext) throw new Error("Context not initialized");
  return externalContext;
};
