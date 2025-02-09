import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import React from "react";
import { AppProvider } from "./app-context";
import { ExplorerProvider } from "./explorer-context";
import { FileProvider } from "./file-context";
import { WebContainerProvider } from "./webcontainer-context";

const room =
  new URLSearchParams(window.location.search).get("room") || "default-room";
const client = new Ably.Realtime({ key: import.meta.env.VITE_ABLY_API_KEY });
const channelName = `project-${room}`;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={channelName}>
        <AppProvider>
          <WebContainerProvider>
            <FileProvider room={room}>
              <ExplorerProvider>{children}</ExplorerProvider>
            </FileProvider>
          </WebContainerProvider>
        </AppProvider>
      </ChannelProvider>
    </AblyProvider>
  );
}
