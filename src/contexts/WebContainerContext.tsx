import { Preview } from "@/components/Layout/right-panel";
import { debugLog } from "@/helpers";
import { webContainerService } from "@/services";
import { PanelData } from "rc-dock";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApp } from "./AppContext";

interface IWebContainerContext {
  loading: boolean;
  error: Error | null;
  isInstalled: boolean;
  setIsInstalled: (value: boolean) => void;
}

const WebContainerContext = createContext<IWebContainerContext>({
  loading: true,
  error: null,
  isInstalled: false,
  setIsInstalled: () => {},
});

export const WebContainerProvider = ({ children }: { children: ReactNode }) => {
  const { dockLayout } = useApp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await webContainerService.init();
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Error initializing WebContainer")
        );
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        webContainerService.onServerReady((port, url) => {
          if (!dockLayout) return;

          const newPreviewTab = {
            id: `${port}`,
            title: `localhost:${port}`,
            content: <Preview previewURL={url} />,
            group: "preview",
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
        });
      } catch (error) {
        debugLog("[WEBCONTAINER] Error starting dev server:", error);
      }
    })();
  }, [dockLayout]);

  return (
    <WebContainerContext.Provider
      value={{
        loading,
        error,
        isInstalled,
        setIsInstalled,
      }}
    >
      {children}
    </WebContainerContext.Provider>
  );
};

export const useWebContainer = () => useContext(WebContainerContext);
