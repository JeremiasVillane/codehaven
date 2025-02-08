import { MAX_LOGS } from "@/constants";
import { ContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";
import { useEffect, useRef, useState } from "react";

export function DebugConsole() {
  const cm = useRef<ContextMenu>(null);
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

  const contextMenu: MenuItem[] = [
    {
      icon: <i className="pi pi-eraser text-[1.4em] pr-2" />,
      label: "Clear console",
      command: () => setLogs([]),
    },
  ];

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cm.current && logs.length > 0) {
      cm.current.show(e);
    }
  };

  return (
    <>
      <ContextMenu model={contextMenu} ref={cm} />

      <div
        onContextMenu={onContextMenu}
        className="size-full overflow-y-auto p-2 font-mono whitespace-pre-wrap text-xs md:text-sm bg-[#f5f5f5] dark:bg-[#04050b] text-[rebeccapurple] dark:text-[#B0A3CE]"
      >
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </>
  );
}
