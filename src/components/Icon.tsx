import React from "react";
import registry from "../icons/registry.json";

// Shared icon source — flat vector glyphs from Iconify packs, pulled offline
// into src/icons/registry.json by `npm run icon -- add <set>:<name>`.
// Deterministic (no runtime fetch) and tiny (only the icons episodes use).
//
// Two ways to use it:
//   <Icon name="fluent-emoji-flat:toilet" size={200} recolor={{ "#CDC4D6": "#fff" }} />
//     — standalone, absolutely positioned, for quick props.
//   getIcon(name).parts.map(...)
//     — inside an episode kit's own <svg>, so each paper piece can carry its
//       own shadow depth / pivot and be rigged. See 012's LavCutaway.
//
// Colors: icon packs ship their own palette. ALWAYS recolor to the episode's
// semantic color law (kit.tsx) — never let Fluent yellow/grey leak on screen.

export type IconName = keyof typeof registry;
export type IconPart = { fill: string; d: string; fillRule?: string };
export type IconData = { w: number; h: number; body: string; parts: IconPart[] };
export type Recolor = Record<string, string>;

export const getIcon = (name: IconName): IconData => registry[name] as IconData;

export const recolorFill = (fill: string, map?: Recolor) => {
  if (!map) return fill;
  const hit = Object.entries(map).find(([k]) => k.toLowerCase() === fill.toLowerCase());
  return hit ? hit[1] : fill;
};

/** Render an icon's pieces as <path>s inside an existing <svg>. */
export const IconPaths: React.FC<{
  name: IconName;
  recolor?: Recolor;
  /** wrap each piece (e.g. with a paper shadow); index is the pack's paint order */
  wrap?: (node: React.ReactNode, i: number, part: IconPart) => React.ReactNode;
}> = ({ name, recolor, wrap }) => {
  const { parts, body } = getIcon(name);
  if (parts.length === 0) return <g dangerouslySetInnerHTML={{ __html: body }} />;
  return (
    <>
      {parts.map((p, i) => {
        const node = (
          <path
            key={i}
            d={p.d}
            fill={recolorFill(p.fill, recolor)}
            fillRule={p.fillRule as React.SVGAttributes<SVGPathElement>["fillRule"]}
          />
        );
        return wrap ? <React.Fragment key={i}>{wrap(node, i, p)}</React.Fragment> : node;
      })}
    </>
  );
};

/** Standalone icon, sized by height, absolutely positioned like the kit pieces. */
export const Icon: React.FC<{
  name: IconName;
  size?: number;
  recolor?: Recolor;
  flipX?: boolean;
  rotate?: number;
  style?: React.CSSProperties;
  wrap?: React.ComponentProps<typeof IconPaths>["wrap"];
}> = ({ name, size = 200, recolor, flipX, rotate = 0, style, wrap }) => {
  const { w, h } = getIcon(name);
  const width = (size * w) / h;
  const t = [flipX ? `translate(${w} 0) scale(-1 1)` : "", rotate ? `rotate(${rotate} ${w / 2} ${h / 2})` : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <svg
      width={width}
      height={size}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", overflow: "visible", ...style }}
    >
      <g transform={t || undefined}>
        <IconPaths name={name} recolor={recolor} wrap={wrap} />
      </g>
    </svg>
  );
};
