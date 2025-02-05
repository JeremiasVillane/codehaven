import { TEMPLATES } from "@/constants";
import { nodeStarter } from "./node-starter";
import { reactJS } from "./react-js";
import { reactTS } from "./react-ts";
import { staticSite } from "./static";
import { vanillaJS } from "./vanilla-js";
import { vanillaTS } from "./vanilla-ts";

export const boilerplates: Record<
  typeof TEMPLATES[number]["id"],
  { template: Record<any, any>; commands?: string[] }
> = {
  "react-js": { template: reactJS, commands: ["npm i", "npm run dev"] },
  "react-ts": { template: reactTS, commands: ["npm i", "npm run dev"] },
  "node-starter": { template: nodeStarter },
  "vanilla-js": { template: vanillaJS, commands: ["npm i", "npm run dev"] },
  "vanilla-ts": { template: vanillaTS, commands: ["npm i", "npm run dev"] },
  "static-site": { template: staticSite, commands: ["npm i", "npm start"] },
};
