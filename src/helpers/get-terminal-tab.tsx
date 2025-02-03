import { Terminal } from "@/components/Layout/middle-panel";

export function getTerminalTab({
  id,
  title,
  commands,
}: {
  id: string;
  title: string;
  commands?: string[];
}) {
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
