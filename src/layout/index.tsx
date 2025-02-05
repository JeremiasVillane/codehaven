import { LayoutData, TabGroup } from "rc-dock";
import { FileExplorer, FileExplorerHeader } from "./left-panel";
import { handleCreateClick } from "./left-panel/file-explorer-handlers";
import { DebugConsole } from "./middle-panel";
import { CodeEditorBlank } from "./middle-panel/code-editor-blank";
import { addTerminal } from "./middle-panel/terminal-utils";
import { PreviewBlank } from "./right-panel/preview-blank";

export const defaultLayout: LayoutData = {
  dockbox: {
    mode: "horizontal",
    children: [
      {
        mode: "vertical",
        size: 111,
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
            tabs: [
              {
                id: "editor-blank",
                title: "Editor",
                content: <CodeEditorBlank />,
                group: "editor",
                minWidth: 222,
                minHeight: 33,
              },
            ],
            minWidth: 222,
            minHeight: 66,
          },
          {
            id: "debug",
            activeId: "terminal",
            panelLock: { panelStyle: "debug" },
            size: 77,
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
            id: "preview-blank",
            title: "Preview",
            content: <PreviewBlank />,
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
    floatable: false,
    maximizable: true,
    tabLocked: true,
  },
  debug: {
    floatable: false,
    maximizable: false,
    tabLocked: true,
    panelExtra: () => (
      <div>
        <i
          role="button"
          title="New terminal"
          onClick={addTerminal}
          className="pi pi-plus hover:text-indigo-400 -mr-3"
        ></i>
      </div>
    ),
  },
  preview: {
    floatable: true,
    maximizable: true,
    tabLocked: false,
  },
};
