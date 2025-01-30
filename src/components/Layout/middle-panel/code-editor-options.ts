import * as monaco from "monaco-editor";

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: "JetBrains Mono",
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: "on",
};

export default editorOptions;
