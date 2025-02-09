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
  restoreBlankTab,
} from "./code-editor-helpers";
import editorOptions from "./code-editor-options";

export const CodeEditor = ({ selectedFile }: { selectedFile: FileData }) => {
  const { theme } = useTheme();
  const { updateFile, sendFileUpdate, currentFile } = useFiles();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorValue, setEditorValue] = useState(selectedFile.content);
  const [currentTheme, setCurrentTheme] = useState<"vs-dark" | "vs-light">(
    `vs-${theme}`
  );
  const [currentSettings, setCurrentSettings] = useState<EditorSettings>(() => {
    const stored = localStorage.getItem("codehaven:editor-settings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

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
    setEditorValue(currentFile.content);
  }, [currentFile.content]);

  useEffect(() => {
    const room = new URLSearchParams(window.location.search).get("room");
    if (!room) {
      const timeoutId = setTimeout(() => {
        updateFile(selectedFile.id, { content: editorValue });
      }, 500);
      return () => clearTimeout(timeoutId);
    }
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

  useEffect(() => () => restoreBlankTab(), []);

  const handleCollaborativeChange = (value: string | undefined) => {
    if (value === undefined) return;

    setEditorValue(value);
    updateFile(selectedFile.id, { content: value });

    const room = new URLSearchParams(window.location.search).get("room");
    if (room) {
      sendFileUpdate(selectedFile.id, value);
    }
  };

  return (
    <Editor
      theme={currentTheme}
      height="100%"
      language={getLanguage(selectedFile.name)}
      value={editorValue}
      beforeMount={handleBeforeMount}
      onMount={(editor) => {
        handleEditorDidMount(editor, editorRef);
      }}
      onChange={(val) => {
        if (val !== undefined) handleCollaborativeChange(val);
      }}
      options={{ ...editorOptions, ...currentSettings }}
    />
  );
};
