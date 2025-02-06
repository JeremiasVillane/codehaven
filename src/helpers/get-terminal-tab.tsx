import { Terminal } from "@/layout/middle-panel";
import { TabData } from "rc-dock";

export function getTerminalTab({
  id,
  title,
  commands,
}: {
  id: string;
  title: string;
  commands?: string[];
}): TabData {
  return {
    id,
    title,
    content: <Terminal {...{ commands }} />,
    group: "debug",
    cached: true,
    minWidth: 222,
    minHeight: 33,
  };
}
