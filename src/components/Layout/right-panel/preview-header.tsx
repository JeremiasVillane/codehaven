import { getAppContext } from "@/contexts/AppContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export function PreviewHeader() {
  return (
    <section className="h-[var(--topbar-height)] flex gap-3 px-6 py-2 justify-between items-center bg-topbar-background text-topbar-foreground text-sm select-none">
      <InputText
        value={getAppContext().previewURL ?? ""}
        className="h-6 rounded-sm w-full"
        disabled
      />
      <Button
        text
        className="rounded-none"
        disabled={getAppContext().previewURL.length < 1}
      >
        <i
          className="pi pi-times hover:text-indigo-400"
          onClick={() => getAppContext().setPreviewURL("")}
        ></i>
      </Button>
    </section>
  );
}
