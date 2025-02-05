import React from "react";
import { AppProvider } from "./app-context";
import { ExplorerProvider } from "./explorer-context";
import { FileProvider } from "./file-context";
import { WebContainerProvider } from "./webcontainer-context";

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
