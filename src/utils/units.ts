// src/utils/units.ts
export const toCFM = (value: number, unit: string) => {
  const u = (unit || "cfm").toLowerCase();
  if (u === "cfm") return value;
  if (u === "m3/h" || u === "m^3/h") return value / 1.69901082; // m3/h -> CFM (1 m3/h = 0.588577... CFM; invert? careful)
  if (u === "l/s" || u === "lps") return value * 2.11888; // L/s -> CFM
  // add more as needed
  throw new Error(`Unsupported flow unit: ${unit}`);
};

export const toCelsius = (value: number, unit: string) => {
  const u = (unit || "c").toLowerCase();
  if (u === "c" || u === "°c") return value;
  if (u === "f" || u === "°f") return (value - 32) * (5 / 9);
  if (u === "k" || u === "°k") return value - 273.15;
  throw new Error(`Unsupported temperature unit: ${unit}`);
};

export const toFeet = (value: number, unit: string) => {
  const u = (unit || "ft").toLowerCase();
  if (u === "ft" || u === "feet") return value;
  if (u === "m" || u === "meter" || u === "meters") return value * 3.28084;
  if (u === "cm") return (value / 100) * 3.28084;
  throw new Error(`Unsupported length unit: ${unit}`);
};
