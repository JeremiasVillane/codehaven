import { IGNORED_PATHS } from "@/constants";
import { getAppContext, getFileContext } from "@/contexts";
import { zipService } from "@/services";
import { MenuItem } from "primereact/menuitem";

export const items: MenuItem[] = [
  {
    label: "Project",
    items: [
      {
        label: "New project...",
        icon: "pi pi-file-plus",
        command: async () => {
          getAppContext().setShowTemplateModal(true);
        },
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

            const filteredFiles = Array.from(e.target.files).filter((file) => {
              const pathParts = file.webkitRelativePath.split("/");
              return !pathParts.some((part) => IGNORED_PATHS.has(part));
            });

            if (filteredFiles.length === 0) return;

            const dataTransfer = new DataTransfer();
            filteredFiles.forEach((file) => dataTransfer.items.add(file));

            await getFileContext().importFiles(dataTransfer.files);
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
        command: async () => {
          getAppContext().setShowSettingsModal(true);
        },
      },
    ],
  },
];
