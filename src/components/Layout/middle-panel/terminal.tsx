import { useFiles } from "@/contexts/FileContext";
import { syncContainerToDB } from "@/services/syncContainerToDB";
import { runCommand } from "@/services/webcontainer";
import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import terminalThemes from "./terminal-themes";
import { useTheme } from "@/hooks/use-theme";
import { debugLog } from "@/helpers";

export function Terminal() {
  const { theme } = useTheme();
  const { loadFiles } = useFiles();

  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef(null);
  const xterm = useRef<XTerm | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  async function doRefresh() {
    try {
      await syncContainerToDB();
      await loadFiles();
      debugLog("SYNCHRONIZED");
    } catch (error) {
      debugLog("SYNC ERROR", error);
    }
  }

  async function startShell() {
    try {
      const process = await runCommand("jsh");
      const writable = process?.input.getWriter();

      process?.output.pipeTo(
        new WritableStream({
          write(data) {
            xterm.current?.write(data);
          },
        })
      );

      let syncTimeout: NodeJS.Timeout;

      xterm.current?.onData(async (data) => {
        writable?.write(data);

        if (data === "\r") {
          clearTimeout(syncTimeout);
          syncTimeout = setTimeout(() => {
            doRefresh();
          }, 1000);
        }
      });

      const exitCode = await process?.exit;
      debugLog("Shell closed, code=", exitCode);
    } catch (err) {
      debugLog(err);
    }
  }

  useEffect(() => {
    (async () => {
      xterm.current = new XTerm({ fontSize: 14 });
      fitAddon.current = new FitAddon();
      xterm.current.loadAddon(fitAddon.current);

      if (terminalRef.current) {
        xterm.current.open(terminalRef.current);
        fitAddon.current.fit();
      }

      await startShell();
    })();

    return () => {
      xterm.current?.dispose();
    };
  }, []);

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
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div ref={terminalRef} className="size-full bg-background" />
    </div>
  );
}
