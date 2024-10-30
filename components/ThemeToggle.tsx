import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid"; // Make sure to install @heroicons/react if not already installed
import { applyThemeProperties } from "../utils/applyThemeProperties";

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        // Initialize theme based on saved preference or system preference
        const savedTheme = localStorage.getItem("theme");
        const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialMode = savedTheme ? savedTheme === "dark" : prefersDarkMode;
        setIsDarkMode(initialMode);
        applyThemeProperties(initialMode); // Apply the initial theme
        document.documentElement.classList.toggle("dark", initialMode);
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
        applyThemeProperties(newMode);
        document.documentElement.classList.toggle("dark", newMode);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition" // Style as needed
        >
            {isDarkMode ? (
                <SunIcon className="w-6 h-6 text-yellow-500" aria-label="Switch to Light Mode" />
            ) : (
                <MoonIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" aria-label="Switch to Dark Mode" />
            )}
        </button>
    );
}
