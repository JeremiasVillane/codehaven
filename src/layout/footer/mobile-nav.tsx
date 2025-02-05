import { PANEL_IDS } from "@/constants";
import { useApp } from "@/contexts";

export function MobileNav() {
  const { activePanel, setActivePanel } = useApp();

  return (
    <div className="fixed h-[var(--footer-height)] bg-[#222] flex justify-around items-center text-white z-[9999] bottom-0 inset-x-0 select-none">
      {PANEL_IDS.map((panel) => (
        <button
          key={panel}
          onClick={() => setActivePanel(panel)}
          className="border-none p-[10px] text-white cursor-pointer"
          style={{
            backgroundColor: activePanel === panel ? "#555" : "transparent",
          }}
        >
          {panel.charAt(0).toUpperCase() + panel.slice(1)}
        </button>
      ))}
    </div>
  );
}
