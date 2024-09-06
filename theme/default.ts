import { ThemeConfig } from "types/ThemeConfig";
import { lightColors, darkColors } from "./colors";

const logoHeight = "50px";

export const lightTheme: ThemeConfig = {
  styles: { colors: lightColors, logoHeight },
  strings: {},
  brand: {},
  nav: {
    primary: [],
    secondary: [
      {
        label: 'Farcaster',
        href: 'https://nounspace.com/s/gnars'
      },
      {
        label: 'Discord',
        href: 'https://discord.gg/gnars'
      },
      {
        label: 'YouTube',
        href: 'https://nounspace.com/s/gnars'
      },
    ],
  },
};

export const darkTheme: ThemeConfig = {
  styles: { colors: darkColors, logoHeight },
  strings: {},
  brand: {},
  nav: {
    primary: [],
    secondary: [],
  },
};
