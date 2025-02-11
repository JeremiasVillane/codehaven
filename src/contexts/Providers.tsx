import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import { Realtime } from "ably";
import { AblyProvider } from "ably/react";
import { nanoid } from "nanoid";
import React from "react";
import { AppProvider } from "./app-context";
import { ExplorerProvider } from "./explorer-context";
import { FileProvider } from "./file-context";
import { WebContainerProvider } from "./webcontainer-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  const urlRoom =
    new URLSearchParams(window.location.search).get("room") || "default-room";
  const client = new Realtime({
    key: import.meta.env.VITE_ABLY_API_KEY,
    clientId: nanoid(),
  });
  const spaces = new Spaces(client);

  return (
    <AblyProvider client={client}>
      <SpacesProvider client={spaces}>
        <SpaceProvider name={urlRoom}>
          <AppProvider>
            <WebContainerProvider>
              <FileProvider>
                <ExplorerProvider>{children}</ExplorerProvider>
              </FileProvider>
            </WebContainerProvider>
          </AppProvider>
        </SpaceProvider>
      </SpacesProvider>
    </AblyProvider>
  );
}
