import { PANEL_IDS } from "@/constants";

export function MobileNav({
  activePanel,
  handleChangePanel,
}: {
  activePanel: string;
  handleChangePanel: (panel: string) => void;
}) {
  return (
    <div className="fixed h-[60] bg-[#222] flex justify-around items-center text-white z-[9999] bottom-0 inset-x-0 select-none">
      {PANEL_IDS.map((panel) => (
        <button
          key={panel}
          onClick={() => handleChangePanel(panel)}
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
