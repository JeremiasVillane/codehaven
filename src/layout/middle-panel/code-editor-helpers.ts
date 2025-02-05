import * as monaco from "monaco-editor";

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
    default:
      return "plaintext";
  }
};
export const handleBeforeMount = (monaco: any) => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: "react",
  });
};

export const handleEditorDidMount = (
  editor: monaco.editor.IStandaloneCodeEditor,
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor>
) => {
  editorRef.current = editor;
};
