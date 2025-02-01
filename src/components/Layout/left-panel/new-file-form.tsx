import { getAppContext } from "@/contexts/AppContext";
import { sanitizeInput } from "@/helpers";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef } from "react";
import { handleKeyDown } from "./file-explorer-handlers";

export default function NewFileForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    newFileName,
    setNewFileName,
    isCreating,
    setIsCreating,
    isCreatingFolder,
    setIsCreatingFolder,
  } = getAppContext();

  return (
    <div className="flex items-center justify-between gap-3">
      {isCreatingFolder ? (
        <i className="pi pi-fw pi-folder" />
      ) : isCreating ? (
        <i className="pi pi-fw pi-file" />
      ) : null}
      <InputText
        ref={inputRef}
        value={newFileName}
        onChange={(e) => sanitizeInput(e, setNewFileName)}
        onKeyDown={handleKeyDown}
        placeholder={isCreatingFolder ? "Folder name" : "filename.ext"}
        maxLength={33}
      />
      <div className="flex items-center gap-3">
        <Button className="rounded-none" disabled={newFileName.length < 1}>
          <i
            className="pi pi-check text-gray-600 hover:text-indigo-400 text-sm"
            title="Create"
          ></i>
        </Button>
        <Button
          onClick={() => {
            setIsCreating(false);
            setIsCreatingFolder(false);
            setNewFileName("");
          }}
          className="rounded-none"
        >
          <i
            className="pi pi-times text-gray-600 hover:text-indigo-400 text-sm"
            title="Cancel"
          ></i>
        </Button>
      </div>
    </div>
  );
}
