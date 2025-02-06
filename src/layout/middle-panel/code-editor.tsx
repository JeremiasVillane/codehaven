import { DEFAULT_SETTINGS } from "@/constants";
import { useFiles } from "@/contexts";
import { useTheme } from "@/hooks";
import { EditorSettings, FileData } from "@/types";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import {
  getLanguage,
  handleBeforeMount,
  handleEditorDidMount,
  persistSettings,
} from "./code-editor-helpers";
import editorOptions from "./code-editor-options";

export const CodeEditor = ({ selectedFile }: { selectedFile: FileData }) => {
  const { theme } = useTheme();
  const { updateFile } = useFiles();
  const [currentTheme, setCurrentTheme] = useState<"vs-dark" | "vs-light">(
    `vs-${theme}`
  );
  const [editorValue, setEditorValue] = useState(selectedFile.content);
  const [currentSettings, setCurrentSettings] = useState<EditorSettings>(() => {
    const stored = localStorage.getItem("codehaven:editor-settings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions(currentSettings);
    }
  }, [editorRef, currentSettings]);

  useEffect(() => {
    const updateSettingsEvent = (e: CustomEvent<EditorSettings>) => {
      setCurrentSettings(e.detail);
      if (editorRef.current) {
        editorRef.current.updateOptions(e.detail);
      }

      persistSettings(e.detail);
    };

    window.addEventListener(
      "editorSettingsChange",
      updateSettingsEvent as EventListener
    );
    return () => {
      window.removeEventListener(
        "editorSettingsChange",
        updateSettingsEvent as EventListener
      );
    };
  }, []);

  useEffect(() => {
    setEditorValue(selectedFile.content);
  }, [selectedFile]);

  useEffect(() => {
    const handler = setTimeout(() => {
      updateFile(selectedFile.id, { content: editorValue });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [editorValue, selectedFile.id, updateFile]);

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<"light" | "dark">) => {
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
      options={{ ...editorOptions, ...currentSettings }}
    />
  );
};
