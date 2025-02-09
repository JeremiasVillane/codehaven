import { getExplorerContext } from "@/contexts";
import { Button } from "primereact/button";
import { AppMenu } from "./app-menu";

export function FileExplorerHeader() {
  return (
    <section className="h-[var(--topbar-height)] w-full flex px-6 justify-between items-center bg-topbar-background text-topbar-foreground text-sm select-none">
      <AppMenu menuRef={getExplorerContext().menuRef} />
      <Button
        text
        onClick={(event) => getExplorerContext().menuRef.current.toggle(event)}
        className="rounded-none"
        aria-controls="app_menu"
        aria-haspopup
      >
        <i title="Menu" className="pi pi-bars hover:text-indigo-400"></i>
      </Button>
    </section>
  );
}
