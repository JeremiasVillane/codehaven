import { useFiles } from "@/contexts/FileContext";
import { useTheme } from "@/hooks/use-theme";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";

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

    // const currentTheme = localStorage.getItem("theme") || "dark";
    monaco.editor.setTheme(`vs-${currentTheme}`);

    window.addEventListener("themeChange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, []);

  const getLanguage = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "ts":
      case "tsx":
        return "typescript";
      case "js":
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
      default:
        return "plaintext";
    }
  };

  if (!currentFile || currentFile.isDirectory) {
    return (
      <div className="h-full">
        <section className="px-4 py-2 bg-topbar-background text-topbar-foreground font-mono text-sm border-b border-border h-9"></section>
        <section className="flex items-center whitespace-nowrap justify-center h-full bg-editor-background text-tertiary select-none">
          Select a file to edit
        </section>
      </div>
    );
  }

  const handleBeforeMount = (monaco: any) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: "react",
    });
  };

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      theme={currentTheme}
      height="100%"
      language={getLanguage(currentFile.name)}
      value={currentFile.content}
      beforeMount={handleBeforeMount}
      onMount={handleEditorDidMount}
      onChange={(value) => {
        if (value !== undefined) {
          updateFileContent(currentFile.id, value);
        }
      }}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "JetBrains Mono",
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "on",
      }}
    />
  );
};
