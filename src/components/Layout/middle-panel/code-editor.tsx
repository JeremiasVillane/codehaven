import { useFiles } from "@/contexts/FileContext";
import { useTheme } from "@/hooks/use-theme";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import {
  getLanguage,
  handleBeforeMount,
  handleEditorDidMount,
} from "./code-editor-helpers";
import editorOptions from "./code-editor-options";

export const CodeEditor = () => {
  const { theme } = useTheme();
  const { currentFile, updateFileContent } = useFiles();
  const [currentTheme, setCurrentTheme] = useState<"vs-dark" | "vs-light">(
    `vs-${theme}`
  );

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<"light" | "dark">) => {
      if (!editorRef.current) return;
      setCurrentTheme(`vs-${e.detail}`);
    };

    // const selectedTheme = localStorage.getItem("codehaven:theme") || theme;
    monaco.editor.setTheme(`vs-${theme}`);

    window.addEventListener("themeChange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, []);

  if (!currentFile || currentFile.isDirectory) {
    return (
      <section className="flex items-center whitespace-nowrap justify-center size-full bg-editor-background text-tertiary select-none">
        Select a file to edit
      </section>
    );
  }

  return (
    <Editor
      theme={currentTheme}
      height="100%"
      language={getLanguage(currentFile.name)}
      value={currentFile.content}
      beforeMount={handleBeforeMount}
      onMount={(editor: monaco.editor.IStandaloneCodeEditor) =>
        handleEditorDidMount(editor, editorRef)
      }
      onChange={(value) => {
        if (value !== undefined) {
          updateFileContent(currentFile.id, value);
        }
      }}
      options={editorOptions}
    />
  );
};
