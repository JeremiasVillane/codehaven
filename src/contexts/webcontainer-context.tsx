import { debugLog } from "@/helpers";
import { Preview } from "@/layout/right-panel";
import { webContainerService } from "@/services";
import { PanelData, TabData } from "rc-dock";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApp } from "./app-context";

interface IWebContainerContext {
  isBooted: boolean;
  error: string | null;
  isInstalled: boolean;
  setIsInstalled: (value: boolean) => void;
  isPopulated: boolean;
  setIsPopulated: (value: boolean) => void;
}

const WebContainerContext = createContext<IWebContainerContext>({
  isBooted: true,
  error: null,
  isInstalled: false,
  setIsInstalled: () => {},
  isPopulated: false,
  setIsPopulated: () => {},
});
let externalContext: IWebContainerContext | null = null;

export const WebContainerProvider = ({ children }: { children: ReactNode }) => {
  const { dockLayout } = useApp();

  const [isBooted, setIsBooted] = useState(false);
  const [isPopulated, setIsPopulated] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await webContainerService.init();
      } catch (err) {
        debugLog("[WEBCONTAINER] Error initializing:", err?.message);
        setError(
          err instanceof Error ? err.message : "Error initializing WebContainer"
        );
      } finally {
        setIsBooted(true);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        webContainerService.onServerReady((port, url) => {
          if (!dockLayout) return;

          setIsInstalled(true);

          setTimeout(() => {
            const newPreviewTab: TabData = {
              id: `${port}`,
              title: `localhost:${port}`,
              content: <Preview previewURL={url} />,
              group: "preview",
              cached: true,
              minWidth: 222,
              minHeight: 66,
            };

            const previewPanel = dockLayout.find("preview");

            if (
              (previewPanel as PanelData).tabs.find(
                (t) => t.id === "preview-blank"
              )
            ) {
              dockLayout.updateTab("preview-blank", newPreviewTab, true);
            }

            dockLayout.dockMove(newPreviewTab, "preview", "middle");
            setIsInstalled(false);
            setIsPopulated(false);
          }, 1000);
        });
      } catch (error) {
        debugLog("[WEBCONTAINER] Error starting dev server:", error);
      }
    })();
  }, [dockLayout]);

  const value = {
    isBooted,
    error,
    isInstalled,
    setIsInstalled,
    isPopulated,
    setIsPopulated,
  };
  externalContext = value;

  return (
    <WebContainerContext.Provider value={value}>
      {children}
    </WebContainerContext.Provider>
  );
};

export const useWebContainer = () => useContext(WebContainerContext);
export const getWebContainerContext = () => {
  if (!externalContext) throw new Error("Context not initialized");
  return externalContext;
};
