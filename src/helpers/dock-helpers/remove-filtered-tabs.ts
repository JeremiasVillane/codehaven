import { PANEL_IDS } from "@/constants";
import { getAppContext } from "@/contexts";
import { PanelData } from "rc-dock";

export function removeFilteredTabs(
  panelId: (typeof PANEL_IDS)[number],
  excludedId: string
) {
  const dockLayout = getAppContext().dockLayout;
  if (!dockLayout) return;

  const panel = dockLayout.find(panelId) as PanelData;

  panel.tabs
    .filter((tab) => tab.id !== excludedId)
    .forEach((tab) => dockLayout.dockMove(tab, null, "remove"));
}
