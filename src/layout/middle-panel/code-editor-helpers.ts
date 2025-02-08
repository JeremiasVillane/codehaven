import { DEFAULT_SETTINGS } from "@/constants";
import { getAppContext } from "@/contexts";
import { addTabToPanel } from "@/helpers";
import { EditorSettings } from "@/types";
import * as monaco from "monaco-editor";
import { PanelData } from "rc-dock";
import { CodeEditorBlank } from "./code-editor-blank";

export const getEditorSettings = (): EditorSettings => {
  const stored = localStorage.getItem("codehaven:editor-settings");
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const persistSettings = (newSettings: EditorSettings) => {
  localStorage.setItem(
    "codehaven:editor-settings",
    JSON.stringify(newSettings)
  );
};

export const restoreBlankTab = () => {
  const dockLayout = getAppContext().dockLayout;
  if (!dockLayout) return;

  const editorPanel = dockLayout.find("editor") as PanelData;
  if (editorPanel.tabs.length < 1) {
    addTabToPanel(
      {
        id: "editor-blank",
        title: "Editor",
        content: CodeEditorBlank,
        group: "editor",
        minWidth: 222,
        minHeight: 33,
      },
      "editor"
    );
  }
};

export const getLanguage = (filename: string) => {
  if (!filename || filename.length < 1) return;

  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "cjs":
    case "mjs":
    case "jsx":
      return "javascript";
    case "css":
      return "css";
    case "html":
      return "html";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "svg":
      return "xml";
    case "yaml":
    case "yml":
      return "yaml";
    case "vue":
      return "vue";
    case "svelte":
      return "svelte";
    default:
      return "plaintext";
  }
};

export const handleBeforeMount = (monacoInstance: any) => {
  monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: "react",
  });

  monacoInstance.languages.register({ id: "vue" });
  monacoInstance.languages.setMonarchTokensProvider("vue", {
    defaultToken: "",
    tokenPostfix: ".vue",
    tokenizer: {
      root: [
        [
          /(<template\b[^>]*>)/,
          { token: "tag", next: "@template", nextEmbedded: "html" },
        ],
        [
          /(<script\b[^>]*>)/,
          { token: "tag", next: "@script", nextEmbedded: "javascript" },
        ],
        [
          /(<style\b[^>]*>)/,
          { token: "tag", next: "@style", nextEmbedded: "css" },
        ],
        [/.+/, ""],
      ],
      template: [
        [
          /(<\/template>)/,
          { token: "tag", next: "@pop", nextEmbedded: "@pop" },
        ],
        [/.+/, ""],
      ],
      script: [
        [/(<\/script>)/, { token: "tag", next: "@pop", nextEmbedded: "@pop" }],
        [/.+/, ""],
      ],
      style: [
        [/(<\/style>)/, { token: "tag", next: "@pop", nextEmbedded: "@pop" }],
        [/.+/, ""],
      ],
    },
  });

  monacoInstance.languages.register({ id: "svelte" });
  monacoInstance.languages.setMonarchTokensProvider("svelte", {
    defaultToken: "",
    tokenPostfix: ".svelte",
    tokenizer: {
      root: [
        [
          /(<script\b[^>]*>)/,
          { token: "tag", next: "@script", nextEmbedded: "javascript" },
        ],
        [
          /(<\/?[\w-]+(?:\s+[\w-]+(?:=(?:"[^"]*"|'[^']*'|[^\s'">=]+))?)*\s*\/?>)/,
          { token: "tag", next: "@template", nextEmbedded: "html" },
        ],
        [
          /(<style\b[^>]*>)/,
          { token: "tag", next: "@style", nextEmbedded: "css" },
        ],
        [/.+/, ""],
      ],
      template: [
        [
          /(<\/template>)/,
          { token: "tag", next: "@pop", nextEmbedded: "@pop" },
        ],
        [/.+/, ""],
      ],
      script: [
        [/(<\/script>)/, { token: "tag", next: "@pop", nextEmbedded: "@pop" }],
        [/.+/, ""],
      ],
      style: [
        [/(<\/style>)/, { token: "tag", next: "@pop", nextEmbedded: "@pop" }],
        [/.+/, ""],
      ],
    },
  });
};

export const handleEditorDidMount = (
  editor: monaco.editor.IStandaloneCodeEditor,
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor>
) => {
  editorRef.current = editor;
};
