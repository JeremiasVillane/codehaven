import {
  CatppuccinNext,
  CibReact,
  FileIconsTypescript,
  MdiNodejs,
  PhFileCodeLight,
  TeenyiconsJavascriptOutline,
  TeenyiconsSvelteOutline,
} from "@/assets";
import { PhFileLight } from "@/assets/BlankIcon";
import { UitVuejsAlt } from "@/assets/VueIcon";
import { cn } from "@/lib/utils";
import { EditorSettings } from "@/types";

export const PANEL_IDS = ["explorer", "editor", "debug", "preview"];

export const DB_NAME = "codehaven";
export const DB_VERSION = 1;

export const MAX_LOGS = 100;

export const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  lineHeight: 1.5,
  wordWrap: "on",
  minimap: { enabled: false },
  persistStorage: "on",
  autoLoadExample: "on",
  autoRunStartupScript: "on",
};

const iconStyle = "size-10 text-indigo-500";
export const TEMPLATES = [
  {
    id: "blank",
    title: "Blank",
    description: "Start with a blank project.",
    icon: <PhFileLight className={cn(iconStyle, "size-12")} />,
    tech: [],
  },
  {
    id: "react-js",
    title: "React/JavaScript",
    description:
      "Start a new React project with JavaScript for dynamic web applications.",
    icon: <CibReact className={iconStyle} />,
    tech: ["React", "JavaScript"],
  },
  {
    id: "react-ts",
    title: "React/TypeScript",
    description: "Build type-safe React applications with TypeScript support.",
    icon: <CibReact className={iconStyle} />,
    tech: ["React", "TypeScript"],
  },
  {
    id: "next-starter",
    title: "Next.js",
    description: "Create server-rendered React applications with Next.js.",
    icon: <CatppuccinNext className={iconStyle} />,
    tech: ["React", "Next.js"],
  },
  {
    id: "vanilla-js",
    title: "Vanilla JavaScript",
    description: "Start with pure JavaScript for lightweight applications.",
    icon: <TeenyiconsJavascriptOutline className={iconStyle} />,
    tech: ["JavaScript"],
  },
  {
    id: "vanilla-ts",
    title: "Vanilla TypeScript",
    description: "Build with TypeScript without any framework.",
    icon: <FileIconsTypescript className={iconStyle} />,
    tech: ["TypeScript"],
  },
  {
    id: "static-site",
    title: "Static Site",
    description: "Create static websites with HTML, CSS, and JavaScript.",
    icon: <PhFileCodeLight className={cn(iconStyle, "size-12")} />,
    tech: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: "node-starter",
    title: "Node.js/Express",
    description: "Create server-side applications with Node.js and Express.",
    icon: <MdiNodejs className={cn(iconStyle, "size-12")} />,
    tech: ["Node.js", "Express"],
  },
  {
    id: "vue-js",
    title: "Vue/JavaScript",
    description:
      "Start a new Vue project with JavaScript for dynamic web applications.",
    icon: <UitVuejsAlt className={cn(iconStyle, "size-11")} />,
    tech: ["Vue", "JavaScript"],
  },
  {
    id: "vue-ts",
    title: "Vue/TypeScript",
    description: "Build type-safe Vue applications with TypeScript support.",
    icon: <UitVuejsAlt className={cn(iconStyle, "size-11")} />,
    tech: ["Vue", "TypeScript"],
  },
  {
    id: "svelte-js",
    title: "Svelte/JavaScript",
    description:
      "Start a new Svelte project with JavaScript for dynamic web applications.",
    icon: <TeenyiconsSvelteOutline className={iconStyle} />,
    tech: ["Svelte", "JavaScript"],
  },
  {
    id: "svelte-ts",
    title: "Svelte/TypeScript",
    description: "Build type-safe Svelte applications with TypeScript support.",
    icon: <TeenyiconsSvelteOutline className={iconStyle} />,
    tech: ["Svelte", "TypeScript"],
  },
] as const;
