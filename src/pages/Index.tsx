import { SettingsModal, TemplateModal } from "@/components";
import { MemberCursors, YourCursor } from "@/components/cursors";
import { PANEL_IDS } from "@/constants";
import { useApp } from "@/contexts";
import { initializeProjectTerminals, setVisibilityControl } from "@/helpers";
import { useIsMobile } from "@/hooks";
import { defaultLayout, groups } from "@/layout";
import { MobileNav } from "@/layout/footer";
import { Header } from "@/layout/header";
import { getEditorSettings } from "@/layout/middle-panel/code-editor-helpers";
import { Member } from "@/types";
import { useMembers } from "@ably/spaces/dist/mjs/react";
import { DockLayout } from "rc-dock";
import "rc-dock/dist/rc-dock.css";
import { useEffect, useRef } from "react";

export default function IndexPage() {
  const {
    setDockLayout,
    dockLayout,
    activePanel,
    showTemplateModal,
    showSettingsModal,
  } = useApp();
  const { self } = useMembers();
  const liveCursors = useRef(null);
  const isMobile = useIsMobile();
  const layoutRef = useRef<DockLayout | null>(null);

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

  useEffect(() => {
    const { autoRunStartupScript } = getEditorSettings();
    if (autoRunStartupScript === "on") {
      initializeProjectTerminals();
    }
  }, []);

  return (
    <main
      id="live-cursors"
      ref={liveCursors}
      className="h-screen w-screen bg-header-background"
    >
      <Header />

      <DockLayout
        ref={layoutRef}
        defaultLayout={defaultLayout}
        groups={groups}
        dropMode="edge"
        style={{
          width: "100vw",
          height: isMobile
            ? "calc(100vh - var(--header-height) - var(--footer-height))"
            : "calc(100vh - var(--header-height))",
          padding: 0,
        }}
      />

      {isMobile && <MobileNav />}
      {showTemplateModal && <TemplateModal />}
      {showSettingsModal && <SettingsModal settings={getEditorSettings()} />}
      <YourCursor self={self as Member | null} parentRef={liveCursors} />
      <MemberCursors />
    </main>
  );
}
