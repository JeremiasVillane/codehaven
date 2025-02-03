import { getAppContext } from "@/contexts/AppContext";
import { getFileContext } from "@/contexts/FileContext";
import { debugLog } from "@/helpers";
import { syncService, webContainerService } from "@/services";
import { Terminal as XTerm } from "@xterm/xterm";
import { PanelData, TabData } from "rc-dock";
import { Terminal } from "./terminal";

async function doRefresh() {
  try {
    await syncService.syncContainerToDB();
    await getFileContext().loadFiles();
  } catch (error) {
    debugLog("[TERMINAL] Sync error", error);
  }
}

export async function startShell(
  xterm: React.MutableRefObject<XTerm>,
  commands?: string[]
) {
  try {
    const process = await webContainerService.runCommand("jsh");
    const writable = process?.input.getWriter();

    process?.output.pipeTo(
      new WritableStream({
        write(data) {
          xterm.current?.write(data);
        },
      })
    );

    let syncTimeout: NodeJS.Timeout;

    xterm.current?.onData(async (data) => {
      writable?.write(data);

      if (data === "\r") {
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
          doRefresh();
        }, 1000);
      }
    });

    if (commands) {
      const cmd = commands.length > 1 ? commands.join(" && ") : commands[0];
      writable?.write(cmd + "\n");
    }

    const exitCode = await process?.exit;
    debugLog("[TERMINAL] Shell closed, code=", exitCode);
  } catch (err) {
    debugLog("[TERMINAL] Failed to start shell", err);
  }
}

export function addTerminal() {
  const dockLayout = getAppContext().dockLayout;
  if (!dockLayout) return;

  const debugPanel = dockLayout.find("debug");
  const numOfTerminals = (debugPanel as PanelData).tabs.filter(
    (t) => t.id !== "console"
  ).length;

  const newTerminal: TabData = {
    id: `terminal${numOfTerminals + 1}`,
    title: `Terminal ${numOfTerminals + 1}`,
    content: <Terminal />,
    group: "debug",
    cached: true,
    closable: true,
    minWidth: 222,
    minHeight: 33,
  };

  dockLayout.dockMove(newTerminal, "debug", "middle");
}
