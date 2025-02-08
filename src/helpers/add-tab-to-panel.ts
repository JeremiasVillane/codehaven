import { PANEL_IDS } from "@/constants";
import { getAppContext } from "@/contexts";
import { PanelData, TabData } from "rc-dock";

export function addTabToPanel(
  newTab: TabData,
  panelId: (typeof PANEL_IDS)[number]
) {
  const dockLayout = getAppContext().dockLayout;
  if (!dockLayout) return;

  const panel = dockLayout.find(panelId) as PanelData;
  if (panel.tabs.find((t) => t.id === newTab.id)) {
    dockLayout.updateTab(newTab.id, newTab, true);
  } else {
    dockLayout.dockMove(newTab, panelId, "middle");
  }
}
