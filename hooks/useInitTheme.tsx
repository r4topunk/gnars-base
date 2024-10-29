import { useEffect } from "react";
import { applyThemeProperties } from "@/utils/applyThemeProperties";

export const useInitTheme = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode = savedTheme ? savedTheme === "dark" : prefersDarkMode;

    applyThemeProperties(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);
};
