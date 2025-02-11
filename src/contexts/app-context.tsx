import DockLayout from "rc-dock";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IAppContext {
  dockLayout: DockLayout;
  setDockLayout: (val: DockLayout) => void;
  projectName: string;
  setProjectName: (val: string) => void;
  activePanel: string;
  setActivePanel: (val: string) => void;
  showTemplateModal: boolean;
  setShowTemplateModal: (val: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (val: boolean) => void;
  showProgress: boolean;
  setShowProgress: (val: boolean) => void;
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
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

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
    showTemplateModal,
    setShowTemplateModal,
    showSettingsModal,
    setShowSettingsModal,
    showProgress,
    setShowProgress,
  };
  externalContext = value;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const getAppContext = () => {
  if (!externalContext) throw new Error("Context not initialized");
  return externalContext;
};
