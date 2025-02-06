import { useApp } from "@/contexts";
import { useEffect, useRef } from "react";
import { PreviewHeader } from "./preview-header";

export function Preview({ previewURL }: { previewURL: string }) {
  const { setShowProgress } = useApp();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleShowSeeding = () => setShowProgress(true);
    window.addEventListener("seeding", handleShowSeeding);

    return () => {
      window.removeEventListener("seeding", handleShowSeeding);
    };
  }, []);

  return (
    <div className="flex flex-col size-full select-none overflow-y-auto">
      <PreviewHeader {...{ iframeRef, previewURL }} />
      <iframe
        ref={iframeRef}
        src={previewURL}
        className="w-full h-full border-none"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}
