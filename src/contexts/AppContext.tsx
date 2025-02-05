import DockLayout from "rc-dock";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IAppContext {
  dockLayout: DockLayout;
  setDockLayout: (dockLayout: DockLayout) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  activePanel: string;
  setActivePanel: (activePanel: string) => void;
}

const AppContext = createContext<IAppContext | null>(null);
let externalContext: IAppContext | null = null;

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
  const [dockLayout, setDockLayout] = useState<DockLayout | null>(null);
  const [projectName, setProjectName] = useState(() => {
    const savedName = localStorage.getItem("codehaven:project-name");
    return savedName || "Untitled project";
  });
  const [activePanel, setActivePanel] = useState("preview");

  useEffect(() => {
    localStorage.setItem("codehaven:project-name", projectName);
  }, [projectName]);

  const value = {
    dockLayout,
    setDockLayout,
    projectName,
    setProjectName,
    activePanel,
    setActivePanel,
  };
  externalContext = value;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const getAppContext = () => {
  if (!externalContext) throw new Error("Context not initialized");
  return externalContext;
};
