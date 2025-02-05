import { useRef } from "react";
import { PreviewHeader } from "./preview-header";

export function Preview({ previewURL }: { previewURL: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex flex-col size-full select-none overflow-y-auto">
      <PreviewHeader {...{ iframeRef, previewURL }} />
      <iframe
        ref={iframeRef}
        src={previewURL}
        className="w-full h-full border-none"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        allow="cross-origin-isolated"
      />
    </div>
  );
}
