import { useExplorer } from "@/contexts";
import { sanitizeInput } from "@/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef } from "react";
import { handleKeyDown, handleSubmit } from "./file-explorer-handlers";

export default function CreateInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    newFileName,
    setNewFileName,
    isCreating,
    setIsCreating,
    isCreatingFolder,
    setIsCreatingFolder,
  } = useExplorer();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <section className="flex items-center gap-3">
        {isCreatingFolder ? (
          <i className="pi pi-fw pi-folder" />
        ) : isCreating ? (
          <i className="pi pi-fw pi-file" />
        ) : null}
        <InputText
          ref={inputRef}
          value={newFileName}
          onChange={(e) => sanitizeInput(e.target.value, setNewFileName)}
          onKeyDown={handleKeyDown}
          placeholder={isCreatingFolder ? "Folder name" : "filename.ext"}
          maxLength={33}
        />
      </section>

      <section className="flex items-center gap-3 ml-8 md:ml-0">
        <Button
          onClick={(e) => {
            handleSubmit(e);
            setIsCreating(false);
            setIsCreatingFolder(false);
          }}
          className="rounded-none"
          disabled={newFileName.length < 1}
        >
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
      </section>
    </div>
  );
}
