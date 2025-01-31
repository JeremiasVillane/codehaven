import { Menu } from "primereact/menu";
import { TreeNode } from "primereact/treenode";
import DockLayout from "rc-dock";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AppContextType {
  dockLayout: DockLayout;
  setDockLayout: (dockLayout: DockLayout) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  menuRef: React.RefObject<Menu>;
  previewURL: string;
  setPreviewURL: (url: string) => void;
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

const AppContext = createContext<AppContextType | null>(null);
let externalContext: AppContextType | null = null;

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within a FileProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const menuRef = useRef<Menu>(null);

  const [dockLayout, setDockLayout] = useState<DockLayout | null>(null);
  const [projectName, setProjectName] = useState(() => {
    const savedName = localStorage.getItem("codehaven:project-name");
    return savedName || "Untitled project";
  });
  const [previewURL, setPreviewURL] = useState<string>("");
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    localStorage.setItem("codehaven:project-name", projectName);
  }, [projectName]);

  const value = {
    dockLayout,
    setDockLayout,
    projectName,
    setProjectName,
    menuRef,
    previewURL,
    setPreviewURL,
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const getAppContext = () => {
  if (!externalContext) throw new Error("Context not initialized");
  return externalContext;
};
