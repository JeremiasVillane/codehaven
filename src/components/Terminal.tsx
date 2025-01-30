import { useFiles } from "@/contexts/FileContext";
import { syncContainerToDB } from "@/services/syncContainerToDB";
import { runCommand } from "@/services/webcontainer";
import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xterm = useRef<XTerm | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const { loadFiles } = useFiles();

  async function doRefresh() {
    try {
      await syncContainerToDB();
      await loadFiles();
      console.log("\r\n[SYNCHRONIZED]\r\n");
    } catch (error) {
      console.error("\r\n[SYNC ERROR]\r\n", error);
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
      console.log("Shell closed, code=", exitCode);
    } catch (err) {
      console.error(err);
      xterm.current?.write(`\r\nError: ${err}\r\n`);
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

  return <div ref={terminalRef} className="grid w-full h-full bg-black" />;
}
