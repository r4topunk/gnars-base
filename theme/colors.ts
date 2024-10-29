import { ThemeColors } from "types/ThemeConfig/ThemeColors";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import { fill, stroke } from "tailwindcss/defaultTheme";

const withRGB = (val: string): `${string}, ${string}, ${string}` => {
  val = val.replace("#", "");
  const match = val.match(/.{1,2}/g)!;
  const [r, g, b] = match.map((x) => parseInt(x, 16));
  return `${r}, ${g}, ${b}`;
};

const fullConfig = resolveConfig(tailwindConfig);
const colors = fullConfig.theme!.colors as any;

export const lightColors: ThemeColors = {
  fill: withRGB("#FFFFFF"), // white background
  muted: withRGB(colors.gray["100"]),
  stroke: withRGB(colors.gray["300"]),
  backdrop: withRGB("#FFFFFF"),
  "text-base": withRGB(colors.gray["900"]), // dark text for light background
  "text-muted": withRGB(colors.gray["500"]),
  "text-inverted": "255, 255, 255", // inverted (light) text for dark mode
  "text-highlighted": withRGB(colors.blue["500"]), // blue highlight for contrast
  "button-accent": withRGB(colors.gray["900"]), // dark button text
  "button-accent-hover": withRGB(colors.gray["700"]),
  "button-muted": withRGB(colors.gray["300"]),
  "proposal-success": withRGB(colors.green["600"]),
  "proposal-danger": withRGB(colors.red["600"]),
  "proposal-muted": withRGB(colors.neutral["500"]),
  "proposal-highlighted": withRGB(colors.blue["600"]),
};

export const darkColors: ThemeColors = {
  fill: "15, 15, 15", // very dark gray background fill
  muted: "30, 30, 30", // very dark gray for muted backgrounds
  stroke: withRGB(colors.neutral["700"]), // darker border color for contrast
  backdrop: "15, 15, 15", // very dark gray for the main background
  "text-base": "255, 255, 255", // light text on dark background
  "text-muted": "150, 150, 150", // muted text with low contrast on dark gray
  "text-inverted": "0, 0, 0", // dark text for inverted scenarios
  "text-highlighted": withRGB(colors.blue["400"]), // softer blue for highlights
  "button-accent": "255, 255, 255", // white text on dark buttons
  "button-accent-hover": "100, 100, 100", // darker hover effect
  "button-muted": "80, 80, 80", // subdued button color in dark mode
  "proposal-success": withRGB(colors.green["400"]), // lighter green for dark mode
  "proposal-danger": withRGB(colors.red["400"]), // lighter red for better contrast
  "proposal-muted": "100, 100, 100", // muted proposal color on dark gray
  "proposal-highlighted": withRGB(colors.blue["500"]), // slightly brightened blue
};

