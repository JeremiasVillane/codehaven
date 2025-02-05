import { useTheme } from "@/hooks";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import terminalThemes from "./terminal-themes";
import { startShell } from "./terminal-utils";

export function Terminal({ commands }: { commands?: string[] }) {
  const { theme } = useTheme();

  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef(null);
  const xterm = useRef<XTerm | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

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

      await startShell(xterm, commands);
    })();

    return () => {
      xterm.current?.dispose();
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
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div ref={terminalRef} className="size-full bg-terminal-background" />
    </div>
  );
}
