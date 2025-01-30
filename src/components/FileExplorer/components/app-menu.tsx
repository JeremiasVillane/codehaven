import { Menu } from "primereact/menu";
import { items } from "./app-menu-items";
import { MutableRefObject } from "react";

export function AppMenu({ menuRef }: { menuRef: MutableRefObject<Menu> }) {
  return (
    <Menu
      model={items}
      popup
      ref={menuRef}
      id="app_menu"
      className="rounded-sm select-none text-sm"
    />
  );
}
