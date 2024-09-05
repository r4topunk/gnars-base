import { ThemeConfig } from "types/ThemeConfig";
import { darkTheme, lightTheme } from "theme/default";
import merge from "lodash.merge";

export const theme: ThemeConfig = merge(darkTheme, {
  styles: {
    fonts: {
      heading: "Londrina Solid",
      nouns: "Londrina Solid",
      body: "Londrina Solid"
    },
    colors: {
      muted: `115, 210, 222`,
      backdrop: `33, 131, 128`,
      fill: `0, 0, 0`,
      stroke: `251, 177, 70`,
      "text-base": `255, 255, 255`,
      "text-muted": `115, 210, 222`,
      "text-inverted": `143, 45, 86`,
      "text-highlighted": `251, 177, 70`,
      "text-pink": `216, 17, 89`,
      "button-accent": `33, 131, 128`,
      "button-accent-hover": `251, 177, 60`,
      "button-muted": `143, 45, 86`,
      "proposal-success": `141, 224, 58`,
      "proposal-danger": `232, 46, 59`,
      "proposal-muted": `216, 17, 89`,
      "proposal-highlighted": `251, 177, 70`,
    }
  },
  nav: {
    primary: [
      { label: "NounsBr", href: "https://NounsBr.com" },
      { label: "About", href: "/about" },
    ],
    secondary: [],
  },
  brand: {
    title: "NounsBr"
  },

} as Partial<ThemeConfig>);
