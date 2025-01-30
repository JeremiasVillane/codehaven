import { GithubIcon, LinkedinIcon } from "@/assets";
import ThemeSwitcher from "./theme-switcher";

export function Header() {
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

      <section className="text-gray-500">Untitled project</section>

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
