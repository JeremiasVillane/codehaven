import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

let ydoc: Y.Doc | null = null;
let provider: WebrtcProvider | null = null;

export function initCollaboration() {
  const searchParams = new URLSearchParams(window.location.search);
  const room = searchParams.get("room");
  if (!room) return null;
  if (!ydoc) {
    ydoc = new Y.Doc();
    provider = new WebrtcProvider(room, ydoc, {
      signaling: ["wss://yjs-signaling-server.herokuapp.com"],
    });
  }
  return ydoc;
}

export function getYDoc() {
  return ydoc;
}

export function getProvider() {
  return provider;
}

export function getFilesMap() {
  if (!ydoc) return null;
  return ydoc.getMap<Y.Text>("files");
}
