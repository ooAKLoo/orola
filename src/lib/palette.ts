export interface Palette {
  key: string;
  colors: string[]; // 1 = solid, 2 = gradient
}

export const PRESETS: Palette[] = [
  { key: "amber", colors: ["#E8A838"] },
  { key: "sage", colors: ["#8FAE8B"] },
  { key: "fog", colors: ["#7B9EC4"] },
  { key: "coral", colors: ["#D4704F"] },
  { key: "violet", colors: ["#9B8EC4"] },
  { key: "blush", colors: ["#D4899B"] },
  { key: "sunset", colors: ["#F2994A", "#D4704F"] },
  { key: "ocean", colors: ["#7B9EC4", "#43B89C"] },
  { key: "dusk", colors: ["#9B8EC4", "#D4899B"] },
];

const presetMap = new Map(PRESETS.map((p) => [p.key, p]));

const FALLBACK = presetMap.get("sage")!;

export function getPalette(key: string | null | undefined): Palette {
  if (!key) return FALLBACK;
  const preset = presetMap.get(key);
  if (preset) return preset;
  if (key.startsWith("#")) return { key, colors: [key] };
  return FALLBACK;
}

/** CSS background value for a palette (solid color or gradient). */
export function paletteBg(colors: string[]): string {
  if (colors.length === 1) return colors[0];
  return `linear-gradient(135deg, ${colors.join(", ")})`;
}

/** Primary (first) color — for box-shadow, text, etc. */
export function palettePrimary(colors: string[]): string {
  return colors[0];
}
