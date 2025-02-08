import { DEFAULT_SETTINGS } from "@/constants";
import { useFiles } from "@/contexts";
import { useTheme } from "@/hooks";
import { getFilesMap, getProvider, getYDoc } from "@/services";
import { EditorSettings, FileData } from "@/types";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
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

  const searchParams = new URLSearchParams(window.location.search);
  const room = searchParams.get("room");
  const isCollaborative = !!room;

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

  useEffect(() => () => restoreBlankTab(), []);

  const handleCollaborativeMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) => {
    handleEditorDidMount(editor, editorRef);

    if (!isCollaborative) return;

    const doc = getYDoc();
    if (!doc) return;
    const filesMap = getFilesMap();
    if (!filesMap) return;

    let ytext: Y.Text;
    if (!filesMap.has(selectedFile.id)) {
      ytext = new Y.Text();
      ytext.insert(0, selectedFile.content);
      filesMap.set(selectedFile.id, ytext);
    } else {
      ytext = filesMap.get(selectedFile.id)!;
    }

    const provider = getProvider();
    if (editor.getModel()) {
      const binding = new MonacoBinding(
        ytext,
        editor.getModel()!,
        new Set([editor]),
        provider?.awareness
      );

      (editorRef.current as any).binding = binding;
    }
  };

  return (
    <Editor
      theme={currentTheme}
      height="100%"
      language={getLanguage(selectedFile.name)}
      // value={editorValue}
      defaultValue={selectedFile.content}
      beforeMount={handleBeforeMount}
      // onMount={(editor: monaco.editor.IStandaloneCodeEditor) =>
      //   handleEditorDidMount(editor, editorRef)
      // }
      onMount={(editor, monacoInstance) =>
        handleCollaborativeMount(editor, monacoInstance)
      }
      {...(!isCollaborative && {
        onChange: (value) => {
          if (value !== undefined) {
            setEditorValue(value);
          }
        },
      })}
      options={{ ...editorOptions, ...currentSettings }}
    />
  );
};
