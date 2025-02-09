import { useApp } from "@/contexts";
import { cn, sanitizeInput } from "@/utils";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";

export function ProjectName({
  isEditingName,
  setIsEditingName,
}: {
  isEditingName: boolean;
  setIsEditingName: (val: boolean) => void;
}) {
  const { projectName, setProjectName } = useApp();
  const [newFileName, setNewFileName] = useState<string>(projectName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingName]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsEditingName(false);
      setNewFileName(projectName);
    }

    if (e.key === "Enter") {
      const trimmedName = newFileName.trim();

      setNewFileName(trimmedName);
      setProjectName(trimmedName);
      setIsEditingName(false);
    }
  };

  return (
    <>
      <section
        title="Edit project name..."
        role="button"
        onClick={() => setIsEditingName(true)}
        className={cn(
          "text-gray-500 cursor-text whitespace-nowrap text-sm md:text-base w-36 md:w-[33rem] text-ellipsis overflow-hidden text-center",
          isEditingName && "hidden"
        )}
      >
        {projectName}
      </section>

      {isEditingName && (
        <InputText
          ref={inputRef}
          value={newFileName}
          onChange={(e) => sanitizeInput(e.target.value, setNewFileName)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setIsEditingName(false);
            setNewFileName(projectName);
          }}
          maxLength={66}
          className="text-center text-base text-foreground h-6"
        />
      )}
    </>
  );
}
