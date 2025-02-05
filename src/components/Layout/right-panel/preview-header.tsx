import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export function PreviewHeader({
  iframeRef,
  previewURL,
}: {
  iframeRef: React.MutableRefObject<HTMLIFrameElement>;
  previewURL: string;
}) {
  const handleReload = () => {
    if (iframeRef.current) {
      const url = new URL(iframeRef.current.src);
      url.searchParams.set("reload", Date.now().toString());
      iframeRef.current.src = url.toString();
    }
  };

  return (
    <section className="h-[var(--topbar-height)] flex gap-3 px-3 py-2 justify-between items-center bg-topbar-background text-topbar-foreground text-sm select-none border-t border-border">
      <InputText value={previewURL} className="h-6 rounded-sm w-full" />
      <Button
        text
        onClick={handleReload}
        className="rounded-none"
        disabled={previewURL.length < 1}
      >
        <i className="pi pi-refresh hover:text-indigo-400 text-sm"></i>
      </Button>
    </section>
  );
}
