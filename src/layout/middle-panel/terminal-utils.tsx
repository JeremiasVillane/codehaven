import { getAppContext, getFileContext } from "@/contexts";
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

export function addTerminal(commands?: string[]) {
  const dockLayout = getAppContext().dockLayout;
  if (!dockLayout) return;

  let lastTerminalNum: number = 0;

  const debugPanel = dockLayout.find("debug");
  const listOfTerminals = (debugPanel as PanelData).tabs.filter(
    (t) => t.id !== "console"
  );

  if (listOfTerminals.length > 0) {
    lastTerminalNum = Number(
      listOfTerminals
        .sort((a, b) => Number(a.id.at(-1)) - Number(b.id.at(-1)))
        .pop()
        .id.at(-1)
    );
  }

  const newTerminal: TabData = {
    id: `terminal${Number(lastTerminalNum) + 1}`,
    title: `Terminal ${Number(lastTerminalNum) + 1}`,
    content: <Terminal {...{ commands }} />,
    group: "debug",
    cached: true,
    closable: true,
    minWidth: 222,
    minHeight: 33,
  };

  dockLayout.dockMove(newTerminal, "debug", "middle");
}
