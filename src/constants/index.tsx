import {
  CibReact,
  FileIconsTypescript,
  MdiNodejs,
  PhFileCodeLight,
  TeenyiconsJavascriptOutline,
} from "@/assets";
import { cn } from "@/lib/utils";

export const PANEL_IDS = ["explorer", "editor", "debug", "preview"];

export const DB_NAME = "codehaven";
export const DB_VERSION = 1;

export const MAX_LOGS = 100;

const iconStyle = "size-10 text-indigo-500";
export const TEMPLATES = [
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
    id: "node-starter",
    title: "Node.js",
    description: "Create server-side applications with Node.js.",
    icon: <MdiNodejs className={cn(iconStyle, "size-12")} />,
    tech: ["Node.js"],
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
] as const;
