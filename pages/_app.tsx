import CustomConnectButton from "@/components/CustomConnectButton";
import { useInitTheme } from "@/hooks/useInitTheme";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { lightTheme, darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import resolveConfig from "tailwindcss/resolveConfig";
import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../configs/wallet";
import "../styles/globals.css";
import tailwindConfig from "../tailwind.config.js";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { applyThemeProperties } from "../utils/applyThemeProperties";
import { type } from "os";
import theme, { width } from "tailwindcss/defaultTheme";
import { json } from "stream/consumers";

const fullConfig = resolveConfig(tailwindConfig);
const bg = (fullConfig.theme?.backgroundColor as any).skin;
const text = (fullConfig.theme?.textColor as any).skin;

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Initialize theme based on saved preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialMode = savedTheme ? savedTheme === "dark" : prefersDarkMode;
    setIsDarkMode(initialMode);
    applyThemeProperties(initialMode);
    document.documentElement.classList.toggle("dark", initialMode);
  }, []);

  const themeConfig = isDarkMode
    ? darkTheme({
      accentColor: bg["muted"],
      accentColorForeground: text["base"],
    })
    : lightTheme({
      accentColor: bg["muted"],
      accentColorForeground: text["base"],
    });

  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={themeConfig}>
          <div className="bg-white dark:bg-[#0f0f0f] text-black dark:text-white h-screen flex">
            <Navbar />
            <div className="flex flex-col p-4 flex-grow h-full overflow-y-auto overflow-x-hidden">
              <div className="w-full pb-0 md:pb-4 flex justify-between gap-8">
                {/* Search bar */}
                <div className="flex w-full max-w-[450px] bg-gray-200 dark:bg-gray-700 rounded-lg pr-2 items-center">
                  <input
                    type="text"
                    className="w-full h-[34px] border-none bg-transparent text-black dark:text-white text-sm font-medium pl-4 pr-2 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                    placeholder="Search..."
                  />
                  <MagnifyingGlassIcon className="text-gray-600 dark:text-gray-300" width={"18px"} />
                </div>

                {/* Right-aligned buttons */}
                <div className="flex items-center gap-4 ml-auto">
                  <CustomConnectButton className="px-6 h-10 rounded-xl border border-gray-300 dark:border-gray-600 transition ease-in-out hover:scale-110 text-sm whitespace-nowrap lg:text-lg text-black dark:text-white" />
                  <ThemeToggle />
                </div>
              </div>
              <Component {...pageProps} />
            </div>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </SWRConfig>
  );

};

export default MyApp;
