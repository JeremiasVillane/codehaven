import { sanitizeInput } from "@/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export default function RenameInput({
  initialValue,
  onConfirm,
  onCancel,
}: {
  initialValue: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onConfirm(value.trim());
    }

    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <InputText
        value={value}
        onChange={(e) => sanitizeInput(e.target.value, setValue)}
        onKeyDown={handleKeyDown}
        maxLength={33}
        autoFocus
      />

      <section className="flex items-center gap-3">
        <Button
          onClick={() => onConfirm(value.trim())}
          className="rounded-none"
          disabled={value.trim().length < 1}
        >
          <i
            className="pi pi-check text-gray-600 hover:text-indigo-400 text-sm"
            title="Create"
          ></i>
        </Button>
        <Button onClick={onCancel} className="rounded-none">
          <i
            className="pi pi-times text-gray-600 hover:text-indigo-400 text-sm"
            title="Cancel"
          ></i>
        </Button>
      </section>
    </div>
  );
}
