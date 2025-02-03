import { defaultLayout, groups } from "@/components/Layout";
import { MobileNav } from "@/components/Layout/footer";
import { Header } from "@/components/Layout/header";
import { PANEL_IDS } from "@/constants";
import { useApp } from "@/contexts/AppContext";
import { setVisibilityControl } from "@/helpers";
import { useIsMobile } from "@/hooks";
import { DockLayout } from "rc-dock";
import "rc-dock/dist/rc-dock.css";
import { useEffect, useRef, useState } from "react";

export default function IndexPage() {
  const { setDockLayout, dockLayout } = useApp();
  const isMobile = useIsMobile();
  const layoutRef = useRef<DockLayout | null>(null);

  const [activePanel, setActivePanel] = useState("preview");

  useEffect(() => {
    setDockLayout(layoutRef.current);
  }, [layoutRef]);

  useEffect(() => {
    if (dockLayout && isMobile) {
      PANEL_IDS.forEach((panel) => {
        setVisibilityControl(panel, panel === activePanel, isMobile);
      });
    } else if (dockLayout) {
      PANEL_IDS.forEach((panel) => {
        setVisibilityControl(panel, true, isMobile);
      });
    }
  }, [isMobile, activePanel, dockLayout]);

  return (
    <main className="h-screen w-screen bg-header-background">
      <Header />

      <DockLayout
        ref={layoutRef}
        defaultLayout={defaultLayout}
        groups={groups}
        dropMode="edge"
        style={{
          width: "100vw",
          height: "calc(100vh - var(--header-height))",
          padding: 0,
        }}
      />

      {isMobile && (
        <MobileNav
          activePanel={activePanel}
          handleChangePanel={setActivePanel}
        />
      )}
    </main>
  );
}
