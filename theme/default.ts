import { ThemeConfig } from "types/ThemeConfig";
import { lightColors, darkColors } from "./colors";
import merge from "lodash.merge";

const logoHeight = "50px";

// Define base light and dark themes
export const lightTheme: ThemeConfig = {
  styles: { colors: lightColors, logoHeight },
  strings: {},
  brand: {},
  nav: {
    primary: [],
    secondary: [
      {
        label: 'Farcaster',
        href: 'https://nounspace.com/s/gnars',
      },
      {
        label: 'Discord',
        href: 'https://discord.gg/gnars',
      },
      {
        label: 'YouTube',
        href: 'https://nounspace.com/s/gnars',
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
    secondary: [
      {
        label: 'Farcaster',
        href: 'https://nounspace.com/s/gnars',
      },
      {
        label: 'Discord',
        href: 'https://discord.gg/gnars',
      },
      {
        label: 'YouTube',
        href: 'https://nounspace.com/s/gnars',
      },
    ],
  },
};

// Function to select theme based on mode
export const getTheme = (isDarkMode: boolean): ThemeConfig => {
  return merge({}, isDarkMode ? darkTheme : lightTheme);
};
