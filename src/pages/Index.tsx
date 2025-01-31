import { defaultLayout, groups } from "@/components/Layout";
import { Header } from "@/components/Layout/header";
import { useApp } from "@/contexts/AppContext";
import { DockLayout } from "rc-dock";
import "rc-dock/dist/rc-dock.css";
import { useEffect, useRef } from "react";

export default function IndexPage() {
  const { setDockLayout } = useApp();
  const layoutRef = useRef<DockLayout | null>(null);

  useEffect(() => {
    setDockLayout(layoutRef.current);
  }, [layoutRef]);

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
    </main>
  );
}
