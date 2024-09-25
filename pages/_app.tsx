import CustomConnectButton from "@/components/CustomConnectButton";
import { useInitTheme } from "@/hooks/useInitTheme";
import {
  MagnifyingGlassIcon
} from "@heroicons/react/20/solid";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import resolveConfig from "tailwindcss/resolveConfig";
import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../configs/wallet";
import "../styles/globals.css";
import tailwindConfig from "../tailwind.config.js";
import Navbar from "@/components/Navbar";

const fullConfig = resolveConfig(tailwindConfig);
const bg = (fullConfig.theme?.backgroundColor as any).skin;
const text = (fullConfig.theme?.textColor as any).skin;

const MyApp = ({ Component, pageProps }: AppProps) => {
  useInitTheme();

  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={lightTheme({
            accentColor: bg["muted"](100),
            accentColorForeground: text["base"](100),
          })}
        >
          <div className="bg-skin-backdrop font-body text-skin-base h-screen flex">
            <Navbar />
            <div className="flex flex-col p-4 flex-grow h-full overflow-y-auto overflow-x-hidden">
              <div className="w-full pb-0 md:pb-4 flex justify-between gap-8">
                <div className="flex w-full max-w-[450px] bg-gray-200 rounded-lg pr-2 items-center">
                  <input
                    type="text"
                    className="w-full h-[34px] border-none bg-transparent text-sm font-medium pl-4 pr-2 shadow-sm placeholder-gray-400 focus:outline-none"
                    placeholder="Search..."
                  />
                  <MagnifyingGlassIcon width={"18px"} />
                </div>
                <CustomConnectButton className="px-6 h-10 rounded-xl border transition ease-in-out hover:scale-110 text-sm whitespace-nowrap lg:text-lg" />
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
