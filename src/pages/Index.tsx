import { SettingsModal } from "@/common/settings-modal";
import { TemplateModal } from "@/common/template-modal";
import { DEFAULT_SETTINGS, PANEL_IDS } from "@/constants";
import { useApp } from "@/contexts";
import { initializeProjectTerminals, setVisibilityControl } from "@/helpers";
import { useIsMobile } from "@/hooks";
import { defaultLayout, groups } from "@/layout";
import { MobileNav } from "@/layout/footer";
import { Header } from "@/layout/header";
import { EditorSettings } from "@/types";
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
  const isMobile = useIsMobile();
  const layoutRef = useRef<DockLayout | null>(null);

  const editorSettings = (): EditorSettings => {
    const stored = localStorage.getItem("codehaven:editor-settings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  };

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
    const currentSettings = editorSettings();
    if (currentSettings.autoRunStartupScript === "on") {
      initializeProjectTerminals();
    }
  }, []);

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
          height: isMobile
            ? "calc(100vh - var(--header-height) - var(--footer-height))"
            : "calc(100vh - var(--header-height))",
          padding: 0,
        }}
      />

      {isMobile && <MobileNav />}
      {showTemplateModal && <TemplateModal />}
      {showSettingsModal && <SettingsModal settings={editorSettings()} />}
    </main>
  );
}
