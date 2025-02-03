import { MAX_LOGS } from "@/constants";
import { useEffect, useState } from "react";

export function DebugConsole() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleAppDebug = (e: CustomEvent<string>) => {
      setLogs((prevLogs) => {
        const newLogs = [...prevLogs, e.detail];
        if (newLogs.length > MAX_LOGS) {
          newLogs.shift();
        }
        return newLogs;
      });
    };

    window.addEventListener("appDebug", handleAppDebug as EventListener);

    return () => {
      window.removeEventListener("appDebug", handleAppDebug as EventListener);
    };
  }, []);

  return (
    <div className="size-full overflow-y-auto p-2 font-mono whitespace-pre-wrap text-sm bg-[#f5f5f5] dark:bg-[#04050b] text-[rebeccapurple] dark:text-[#B0A3CE]">
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  );
}
