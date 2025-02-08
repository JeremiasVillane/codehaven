import { addTabToPanel, removeFilteredTabs } from "@/helpers";
import { useTheme } from "@/hooks";
import { webContainerService } from "@/services";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { PreviewBlank } from "../right-panel/preview-blank";
import terminalThemes from "./terminal-themes";
import { startShell } from "./terminal-utils";

export function Terminal({ commands }: { commands?: string[] }) {
  const { theme } = useTheme();

  const terminalRef = useRef<HTMLDivElement>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const xterm = useRef<XTerm | null>(null);
  const processRef = useRef<any>(null);
  const containerRef = useRef(null);

  //*** INITIALIZATION ***//
  useEffect(() => {
    (async () => {
      xterm.current = new XTerm({ fontSize: 14 });
      fitAddon.current = new FitAddon();
      xterm.current.loadAddon(fitAddon.current);

      if (terminalRef.current) {
        xterm.current.open(terminalRef.current);
        fitAddon.current.fit();
      }

      processRef.current = await startShell(xterm, commands);
    })();

    return () => {
      if (processRef.current) {
        processRef.current.kill();
      }
      webContainerService.killJshSession();
      xterm.current?.dispose();

      removeFilteredTabs("preview", "preview-blank");
      addTabToPanel(
        {
          id: "preview-blank",
          title: "Preview",
          content: <PreviewBlank />,
          minWidth: 222,
          minHeight: 66,
          group: "preview",
        },
        "preview"
      );
    };
  }, []);

  //*** RESIZE HANDLING ***//
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (fitAddon.current) {
        fitAddon.current.fit();
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  //*** THEME HANDLING ***/
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<"light" | "dark">) => {
      if (!terminalRef.current || !xterm) return;

      xterm.current.options.theme = terminalThemes[e.detail];
    };

    xterm.current.options.theme = terminalThemes[theme];

    window.addEventListener("themeChange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, []);

  return (
    <div ref={containerRef} className="size-full overflow-hidden">
      <div ref={terminalRef} className="size-full bg-terminal-background" />
    </div>
  );
}
