import { GithubIcon, LinkedinIcon } from "@/assets";
import { getAppContext, useApp, useFiles } from "@/contexts";
import { initializeProjectTerminals } from "@/helpers";
import { useIsMobile } from "@/hooks";
import { cn, sanitizeInput } from "@/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import ThemeSwitcher from "./theme-switcher";

export function Header() {
  const { files } = useFiles();
  const { projectName, setProjectName } = useApp();
  const isMobile = useIsMobile();

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

  const handleRun = () => {
    initializeProjectTerminals();
    getAppContext().setActivePanel("preview");
  };

  return (
    <header className="flex items-center justify-between py-2 px-3 md:px-6 bg-header-background select-none w-full h-[var(--header-height)]">
      <h1
        className={cn(
          "flex items-center gap-2 group relative",
          isMobile && isEditingName ? "hidden" : ""
        )}
      >
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
          className="left-6 opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 dark:invert hidden md:flex"
        />
      </h1>

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

      <section className="flex items-center gap-1 md:gap-2">
        <Button
          title="Run the current project"
          onClick={handleRun}
          className={cn(
            "primary-button",
            "text-indigo-600 md:text-white h-6 px-0.5 md:px-3 text-xs md:text-sm flex items-center gap-2 bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent shadow-none md:shadow-sm md:bg-indigo-700 md:dark:bg-indigo-900 md:hover:bg-indigo-600 md:dark:hover:bg-indigo-800 mr-1 md:mr-10",
            isMobile && isEditingName ? "hidden" : ""
          )}
          disabled={files.length < 1}
        >
          <i className="pi pi-play-circle" />{" "}
          <span className="hidden md:flex">Run</span>
        </Button>

        <ThemeSwitcher />

        <span className="px-0.5 md:px-2 text-gray-400">|</span>

        <a
          title="GitHub"
          href="https://github.com/JeremiasVillane/"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-visible:outline-[#b1b3f8]"
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
          className="focus-visible:outline-[#b1b3f8]"
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
