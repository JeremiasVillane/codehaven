import { getFileContext } from "@/contexts";
import { zipService } from "@/services";
import { MenuItem } from "primereact/menuitem";

export const items: MenuItem[] = [
  {
    label: "Project",
    items: [
      {
        label: "New",
        icon: "pi pi-plus",
        command: async () => await getFileContext().clearFiles(),
      },
      {
        label: "Export...",
        icon: "pi pi-file-export",
        command: () => zipService.exportProject(getFileContext().files),
      },
      {
        label: "Import...",
        icon: "pi pi-folder-plus",
        command: () => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.webkitdirectory = true;
          input.onchange = async (event: Event) => {
            const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
            if (!e.target.files?.length) return;

            await getFileContext().importFiles(e.target.files);
          };
          document.body.appendChild(input);
          input.click();
          document.body.removeChild(input);
        },
      },
    ],
  },
  {
    label: "App",
    items: [
      {
        label: "Settings",
        icon: "pi pi-cog",
      },
    ],
  },
];
