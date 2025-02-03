import { debugLog } from "@/helpers";
import { webContainerService } from "@/services";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApp } from "./AppContext";
import { Preview } from "@/components/Layout/right-panel";

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

          dockLayout.dockMove(
            {
              id: `${port}`,
              title: `localhost:${port}`,
              content: <Preview previewURL={url} />,
              group: "preview",
              minWidth: 222,
              minHeight: 66,
            },
            "preview",
            "middle"
          );
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
