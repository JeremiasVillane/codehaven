import { GithubIcon, LinkedinIcon } from "@/assets";
import {
  CollaborationLinkButton,
  AvatarStack,
  ProjectName,
  RunButton,
} from "@/components";
import { useIsMobile } from "@/hooks";
import { cn } from "@/utils";
import { useState } from "react";
import ThemeSwitcher from "./theme-switcher";

export function Header() {
  const isMobile = useIsMobile();
  const [isEditingName, setIsEditingName] = useState(false);

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

      <ProjectName
        isEditingName={isEditingName}
        setIsEditingName={setIsEditingName}
      />

      <section className="flex items-center gap-1 md:gap-2">
        {isMobile && isEditingName ? null : (
          <div className="flex items-center gap-1.5">
            <AvatarStack />
            <span className="px-0.5 md:px-2 text-gray-400">|</span>
          </div>
        )}

        <CollaborationLinkButton isHidden={isMobile && isEditingName} />
        <RunButton isHidden={isMobile && isEditingName} />
        <ThemeSwitcher />

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
