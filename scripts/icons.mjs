// Icon registry — pulls single icons out of installed `@iconify-json/*` packs
// into `src/icons/registry.json` so the render bundle carries only what the
// episodes use (the fluent-emoji-flat pack alone is 8.5 MB).
//
//   npm run icon -- add fluent-emoji-flat:toilet fluent-emoji-flat:airplane
//   npm run icon -- find fluent-emoji-flat hand        (search names in a pack)
//   npm run icon -- list                                (what's in the registry)
//
// Licenses: only add from sets that need no attribution (MIT / ISC / Apache /
// CC0). fluent-emoji-flat = MIT. Never openmoji (CC BY-SA).
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { getIconData, iconToSVG } from "@iconify/utils";

const require = createRequire(import.meta.url);
const REG = new URL("../src/icons/registry.json", import.meta.url);
const registry = existsSync(REG) ? JSON.parse(readFileSync(REG, "utf8")) : {};

const loadSet = (set) => {
  try {
    return require(`@iconify-json/${set}`);
  } catch {
    console.error(`pack not installed: npm i -D @iconify-json/${set}`);
    process.exit(1);
  }
};

// Fluent flat icons are lists of `<path fill d/>` — split them into pieces so
// scenes can rig each piece (own shadow depth, own pivot). Anything fancier
// (gradients, clip paths) keeps only the raw body.
const splitParts = (body) => {
  const parts = [];
  const re = /<path\s+([^>]*?)\/>/g;
  let m;
  let consumed = 0;
  while ((m = re.exec(body))) {
    consumed += m[0].length;
    const attr = (k) => m[1].match(new RegExp(`${k}="([^"]*)"`))?.[1];
    const d = attr("d");
    if (!d) return [];
    parts.push({ fill: attr("fill") ?? "currentColor", d, ...(attr("fill-rule") ? { fillRule: attr("fill-rule") } : {}) });
  }
  const rest = body.replace(/<\/?g[^>]*>/g, "").replace(/<path\s+[^>]*?\/>/g, "").trim();
  return rest ? [] : parts;
};

const [cmd, ...rest] = process.argv.slice(2);

if (cmd === "add") {
  for (const id of rest) {
    const [set, name] = id.split(":");
    const pack = loadSet(set);
    const data = getIconData(pack.icons, name);
    if (!data) {
      console.error(`no icon "${name}" in ${set}`);
      process.exit(1);
    }
    const svg = iconToSVG(data);
    const vb = svg.attributes.viewBox.split(" ").map(Number);
    registry[id] = { w: vb[2], h: vb[3], body: svg.body, parts: splitParts(svg.body), license: pack.info?.license?.title ?? "?" };
    console.log(`+ ${id}  (${registry[id].parts.length} parts, ${registry[id].license})`);
  }
  writeFileSync(REG, JSON.stringify(Object.fromEntries(Object.entries(registry).sort()), null, 1) + "\n");
} else if (cmd === "find") {
  const [set, q = ""] = rest;
  const pack = loadSet(set);
  console.log(Object.keys(pack.icons.icons).filter((n) => n.includes(q)).join("\n"));
} else if (cmd === "list") {
  for (const [id, v] of Object.entries(registry)) console.log(`${id}  ${v.w}×${v.h}  ${v.parts.length} parts  ${v.license}`);
} else {
  console.log("usage: npm run icon -- add <set>:<name>... | find <set> <query> | list");
}
