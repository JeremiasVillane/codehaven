import { TEMPLATES } from "@/constants";
import { blank } from "./blank";
import { nextStarter } from "./next";
import { nodeStarter } from "./node-starter";
import { reactJS } from "./react-js";
import { reactTS } from "./react-ts";
import { staticSite } from "./static";
import { svelteJS } from "./svelte-js";
import { svelteTS } from "./svelte-ts";
import { vanillaJS } from "./vanilla-js";
import { vanillaTS } from "./vanilla-ts";
import { vueJS } from "./vue-js";
import { vueTS } from "./vue-ts";

export const boilerplates: Record<
  (typeof TEMPLATES)[number]["id"],
  { template: Record<any, any>; commands?: string[] }
> = {
  blank: { template: blank },
  "react-js": { template: reactJS, commands: ["npm i", "npm run dev"] },
  "react-ts": { template: reactTS, commands: ["npm i", "npm run dev"] },
  "next-starter": { template: nextStarter, commands: ["npm i", "npm run dev"] },
  "vanilla-js": { template: vanillaJS, commands: ["npm i", "npm run dev"] },
  "vanilla-ts": { template: vanillaTS, commands: ["npm i", "npm run dev"] },
  "static-site": { template: staticSite, commands: ["npm i", "npm start"] },
  "node-starter": { template: nodeStarter, commands: ["npm i", "npm start"] },
  "vue-js": { template: vueJS, commands: ["npm i", "npm run dev"] },
  "vue-ts": { template: vueTS, commands: ["npm i", "npm run dev"] },
  "svelte-js": { template: svelteJS, commands: ["npm i", "npm run dev"] },
  "svelte-ts": { template: svelteTS, commands: ["npm i", "npm run dev"] },
};
