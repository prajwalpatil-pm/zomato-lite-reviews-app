import type { CSSProperties } from "react";

// A Google Material Symbol. Size is set with a text-[NNpx] class; fill toggles
// the solid vs outline variant. Safe in both server and client components.
export function Sym({
  name,
  className = "",
  fill = false,
  style,
}: {
  name: string;
  className?: string;
  fill?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0", ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
