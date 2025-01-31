import { getAppContext } from "@/contexts/AppContext";
import { Button } from "primereact/button";
import { AppMenu } from "./app-menu";
import { handleCreateClick } from "./file-explorer-handlers";

export function FileExplorerHeader() {
  return (
    <section className="h-[var(--topbar-height)] w-full flex px-6 justify-between items-center bg-topbar-background text-topbar-foreground text-sm select-none">
      <AppMenu menuRef={getAppContext().menuRef} />
      <Button
        text
        onClick={(event) => getAppContext().menuRef.current.toggle(event)}
        className="rounded-none"
        aria-controls="app_menu"
        aria-haspopup
      >
        <i title="Menu" className="pi pi-bars hover:text-indigo-400"></i>
      </Button>

      <div className="group-hover:flex items-end gap-3 hidden">
        <i
          role="button"
          title="New file..."
          onClick={() => handleCreateClick(false)}
          className="pi pi-file-plus hover:text-indigo-400"
        ></i>

        <i
          role="button"
          title="New folder..."
          onClick={() => handleCreateClick(true)}
          className="pi pi-folder-plus hover:text-indigo-400"
        ></i>
      </div>
    </section>
  );
}
