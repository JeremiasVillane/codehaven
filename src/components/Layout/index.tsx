import { LayoutData, TabGroup } from "rc-dock";
import { FileExplorer, FileExplorerHeader } from "./left-panel";
import { handleCreateClick } from "./left-panel/file-explorer-handlers";
import { DebugConsole } from "./middle-panel";
import { Preview } from "./right-panel";

export const defaultLayout: LayoutData = {
  dockbox: {
    mode: "horizontal",
    children: [
      {
        mode: "vertical",
        children: [
          {
            id: "explorer",
            panelLock: { panelStyle: "explorer" },
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
            panelLock: { panelStyle: "card editor" },
            tabs: [],
            minWidth: 222,
            minHeight: 66,
          },
          {
            id: "debug",
            activeId: "terminal",
            panelLock: { panelStyle: "debug" },
            tabs: [
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
        id: "preview",
        panelLock: { panelStyle: "card preview" },
        tabs: [
          {
            title: "Preview",
            content: <Preview />,
            minWidth: 222,
            minHeight: 66,
            group: "preview",
          },
        ],
      },
    ],
  },
};

export const groups: Record<string, TabGroup> = {
  explorer: {
    floatable: false,
    maximizable: false,
    panelExtra: () => (
      <div>
        <i
          role="button"
          title="New file..."
          onClick={() => handleCreateClick(false)}
          className="pi pi-file-plus hover:text-indigo-400"
        ></i>

        <i
          role="button"
          title="New folder..."
          onClick={() => handleCreateClick(true)}
          className="pi pi-folder-plus hover:text-indigo-400"
        ></i>
      </div>
    ),
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
