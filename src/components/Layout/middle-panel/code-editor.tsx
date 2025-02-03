import { useFiles } from "@/contexts/FileContext";
import { useTheme } from "@/hooks";
import { FileData } from "@/types";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import {
  getLanguage,
  handleBeforeMount,
  handleEditorDidMount,
} from "./code-editor-helpers";
import editorOptions from "./code-editor-options";

export const CodeEditor = ({ selectedFile }: { selectedFile: FileData }) => {
  const { theme } = useTheme();
  const { updateFileContent } = useFiles();
  const [currentTheme, setCurrentTheme] = useState<"vs-dark" | "vs-light">(
    `vs-${theme}`
  );

  const [editorValue, setEditorValue] = useState(selectedFile.content);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    setEditorValue(selectedFile.content);
  }, [selectedFile]);

  useEffect(() => {
    const handler = setTimeout(() => {
      updateFileContent(selectedFile.id, editorValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [editorValue, selectedFile.id, updateFileContent]);

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<"light" | "dark">) => {
      if (!editorRef.current) return;
      setCurrentTheme(`vs-${e.detail}`);
    };

    monaco.editor.setTheme(`vs-${theme}`);

    window.addEventListener("themeChange", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, [theme]);

  return (
    <Editor
      theme={currentTheme}
      height="100%"
      language={getLanguage(selectedFile.name)}
      value={editorValue}
      beforeMount={handleBeforeMount}
      onMount={(editor: monaco.editor.IStandaloneCodeEditor) =>
        handleEditorDidMount(editor, editorRef)
      }
      onChange={(value) => {
        if (value !== undefined) {
          setEditorValue(value);
        }
      }}
      options={editorOptions}
    />
  );
};
