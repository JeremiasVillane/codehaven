import { LayoutData, TabGroup } from "rc-dock";
import { FileExplorer, FileExplorerHeader } from "./left-panel";
import { DebugConsole, Terminal } from "./middle-panel";
import { Preview } from "./right-panel";

export const defaultLayout: LayoutData = {
  dockbox: {
    mode: "horizontal",
    children: [
      {
        id: "file-explorer",
        mode: "vertical",
        children: [
          {
            tabs: [
              {
                title: <FileExplorerHeader />,
                content: <FileExplorer />,
                group: "explorer",
                minWidth: 222,
                minHeight: 66,
              },
            ],
          },
        ],
      },
      {
        mode: "vertical",
        children: [
          {
            id: "editor",
            tabs: [],
            panelLock: { panelStyle: "card" },
            minWidth: 222,
            minHeight: 66,
          },
          {
            id: "debug",
            activeId: "terminal",
            tabs: [
              {
                id: "terminal",
                title: "Terminal",
                content: <Terminal />,
                group: "debug",
                cached: true,
                minWidth: 222,
                minHeight: 33,
              },
              {
                id: "console",
                title: "Debug Console",
                content: <DebugConsole />,
                group: "debug",
                cached: true,
                minWidth: 222,
                minHeight: 33,
              },
            ],
          },
        ],
      },
      {
        tabs: [
          {
            title: "Preview",
            content: <Preview />,
            minWidth: 444,
            minHeight: 66,
            group: "preview",
          },
        ],
        panelLock: { panelStyle: "card" },
      },
    ],
  },
};

export const groups: Record<string, TabGroup> = {
  explorer: {
    floatable: false,
    maximizable: false,
  },
  editor: {
    floatable: true,
    maximizable: true,
    tabLocked: true,
  },
  debug: {
    floatable: false,
    maximizable: false,
    tabLocked: true,
  },
  preview: {
    floatable: true,
    maximizable: true,
    tabLocked: true,
  },
};
