import React from "react";
import { AppProvider } from "./AppContext";
import { ExplorerProvider } from "./ExplorerContext";
import { FileProvider } from "./FileContext";
import { WebContainerProvider } from "./WebContainerContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <WebContainerProvider>
        <FileProvider>
          <ExplorerProvider>{children}</ExplorerProvider>
        </FileProvider>
      </WebContainerProvider>
    </AppProvider>
  );
}
