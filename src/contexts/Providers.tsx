import React from "react";
import { FileProvider } from "./FileContext";
import { AppProvider } from "./AppContext";
import { WebContainerProvider } from "./WebContainerContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <WebContainerProvider>
        <FileProvider>{children}</FileProvider>
      </WebContainerProvider>
    </AppProvider>
  );
}
