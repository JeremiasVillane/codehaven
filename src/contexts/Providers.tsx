import React from "react";
import { FileProvider } from "./FileContext";
import { AppProvider } from "./AppContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <FileProvider>{children}</FileProvider>
    </AppProvider>
  );
}
