import { FileExplorer, FileExplorerHeader } from "./left-panel";
import { CodeEditor, CodeEditorHeader, Terminal } from "./middle-panel";
import { Preview } from "./right-panel";
import PreviewHeader from "./right-panel/preview-header";

export const panels = [
  {
    id: "panel-1",
    defaultSize: 20,
    minSize: 12,
    maxSize: 33,
    header: <FileExplorerHeader />,
    content: <FileExplorer />,
  },
  {
    id: "panel-2",
    defaultSize: 40,
    minSize: 12,
    header: <CodeEditorHeader />,
    content: null,
    subPanels: [
      {
        id: "subpanel-1",
        defaultSize: 67,
        header: null,
        content: <CodeEditor />,
      },
      {
        id: "subpanel-2",
        defaultSize: 33,
        header: null,
        content: <Terminal />,
      },
    ],
  },
  {
    id: "panel-3",
    defaultSize: 40,
    header: <PreviewHeader />,
    content: <Preview />,
  },
];
