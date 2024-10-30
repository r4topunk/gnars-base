import { fill, stroke } from "tailwindcss/defaultTheme";
import { ThemeColors } from "types/ThemeConfig/ThemeColors";

export const darkTheme: ThemeColors = {
    muted: `18, 18, 18`, // dark background
    backdrop: `24, 24, 24`, // slightly lighter background
    fill: `255, 255, 255`, // white text
    stroke: `128, 128, 128`, // gray stroke
    "text-base": `255, 255, 255`,
    "text-muted": `200, 200, 200`,
    "text-inverted": `0, 0, 0`,
    "text-highlighted": `255, 165, 0`, // orange
    "button-accent": `50, 205, 50`, // green
    "button-accent-hover": `34, 139, 34`,
    "button-muted": `128, 128, 128`,
    "proposal-success": `50, 205, 50`,
    "proposal-danger": `255, 69, 0`, // red
    "proposal-muted": `128, 128, 128`,
    "proposal-highlighted": `255, 165, 0`,
};
