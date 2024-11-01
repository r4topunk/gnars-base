import { getTheme } from "theme/default";


export const applyThemeProperties = (isDarkMode: boolean) => {
  const theme = getTheme(isDarkMode);
  const root = document.documentElement;

  if (theme.styles?.colors) {
    Object.entries(theme.styles.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, `rgba(${value})`);
    });
  }

  if (theme.styles?.logoHeight) {
    root.style.setProperty(`--logo-height`, theme.styles.logoHeight);
  }
};

