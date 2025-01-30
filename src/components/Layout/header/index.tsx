import { GithubIcon, LinkedinIcon } from "@/assets";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import ThemeSwitcher from "./theme-switcher";

export function Header() {
  const { projectName, setProjectName } = useApp();
  const [isEditingName, setIsEditingName] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    inputValue = inputValue.replace(/[^a-zA-Z0-9 ]/g, ""); // only letters, numbers and spaces
    inputValue = inputValue.replace(/\s+/g, " "); // delete multiple spaces

    setNewFileName(inputValue);
  };

  return (
    <header className="flex items-center justify-between py-2 px-6 bg-header-background border-b select-none">
      <h1 className="flex items-center gap-2 group relative">
        <img
          src="/codehaven-logo.png"
          width="21rem"
          draggable={false}
          className="z-10"
        />
        <img
          src="/codehaven-name.png"
          width="140rem"
          draggable={false}
          className="left-6 opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 dark:invert"
        />
      </h1>

      <section
        title="Edit project name..."
        role="button"
        onClick={() => setIsEditingName(true)}
        className={cn("text-gray-500 cursor-text", isEditingName && "hidden")}
      >
        {projectName}
      </section>

      {isEditingName && (
        <InputText
          ref={inputRef}
          value={newFileName}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditingName(false)}
          maxLength={66}
          className="text-center text-base text-foreground h-6"
        />
      )}

      <section className="flex items-center gap-2">
        <ThemeSwitcher />
        <span className="px-2 text-gray-400">|</span>
        <a
          title="GitHub"
          href="https://github.com/JeremiasVillane/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon
            width={21}
            className="text-indigo-600 cursor-pointer hover:text-indigo-500"
          />
        </a>
        <a
          title="LinkedIn"
          href="https://www.linkedin.com/in/jeremias-villane/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon
            width={21}
            className="text-indigo-600 cursor-pointer hover:text-indigo-500"
          />
        </a>
      </section>
    </header>
  );
}
