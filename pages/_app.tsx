import CustomConnectButton from "@/components/CustomConnectButton";
import { useInitTheme } from "@/hooks/useInitTheme";
import {
  HomeIcon,
  LightBulbIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  QueueListIcon,
  TableCellsIcon,
} from "@heroicons/react/20/solid";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import resolveConfig from "tailwindcss/resolveConfig";
import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../configs/wallet";
import "../styles/globals.css";
import tailwindConfig from "../tailwind.config.js";
import Link from "next/link";

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
            <div className="w-[140px] lg:w-[220px] md:flex flex-col px-4 lg:px-8 py-4 hidden">
              <a className="text-3xl mb-8">Gnars</a>
              <div className="w-[220px] flex flex-col">
                <a>MENU</a>
                <div className="font-xl flex flex-col pt-4 gap-4">
                  <Link href={"/"} className="flex gap-2 items-center">
                    <div className="p-2 rounded-lg bg-[#CA6CFF]">
                      <HomeIcon width={"18px"} color="white" />
                    </div>
                    <a className="">Discover</a>
                  </Link>
                  <button className="flex gap-2 items-center group">
                    <div className="p-2 bg-zinc-200 rounded-lg group-hover:bg-[#CA6CFF] group-hover:shadow-sm">
                      <LinkIcon
                        width={"18px"}
                        color="black"
                        className="color-white"
                      />
                    </div>
                    <a className="">Gnars</a>
                  </button>
                  <button className="flex gap-2 items-center group">
                    <div className="p-2 bg-zinc-200 rounded-lg group-hover:bg-[#CA6CFF] group-hover:shadow-sm">
                      <LightBulbIcon width={"18px"} color="black" />
                    </div>
                    <a className="">About</a>
                  </button>
                  <Link href={"/vote"} className="flex gap-2 items-center group">
                    <div className="p-2 bg-zinc-200 rounded-lg group-hover:bg-[#CA6CFF] group-hover:shadow-sm">
                      <QueueListIcon width={"18px"} color="black" />
                    </div>
                    <a className="">Proposals</a>
                  </Link>
                  <button className="flex gap-2 items-center group">
                    <div className="p-2 bg-zinc-200 rounded-lg group-hover:bg-[#CA6CFF] group-hover:shadow-sm">
                      <TableCellsIcon width={"18px"} color="black" />
                    </div>
                    <a className="">Propdates</a>
                  </button>
                </div>
              </div>
            </div>
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
