import {
  HomeIcon,
  LightBulbIcon,
  LinkIcon,
  QueueListIcon,
  TableCellsIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { DAO_ADDRESS, USDC_ADDRESS } from "constants/addresses";
import { BASE_SENDIT_TOKEN_ADDRESS, BASE_WETH_TOKEN_ADDRESS } from "constants/gnarsDao";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useEffect,
  useState
} from "react";
import { useBalance } from "wagmi";
import FarcasterIcon from "./FarcasterIcon";
import { TokenData } from "../pages/api/treasury/[address]";

function Navbar() {
  return (
    <div className="w-[140px] lg:w-[220px] md:flex flex-col px-4 lg:px-8 py-4 hidden justify-between h-full">
      <div>
        <div className="flex gap-2 items-center mb-6">
          <Image src={"/logo.png"} alt="logo" width={24} height={24} className="w-6 h-6" />
          <span className="text-3xl">Gnars</span>
        </div>
        <div className="w-[220px] flex flex-col mt-5">
          <a>MENU</a>
          <div className="font-xl flex flex-col pt-4 gap-4">
            <NavbarItem
              href="/"
              text="Discover"
              icon={HomeIcon}
              color="#CA6CFF"
            />
            <NavbarItem
              href="/about"
              text="About"
              icon={LightBulbIcon}
              color="#8FD1F9"
            />
            <NavbarItem
              href="/vote"
              text="Proposals"
              icon={QueueListIcon}
              color="#51DB6E"
            />
            <NavbarItem
              href="/propdates"
              text="Propdates"
              icon={TableCellsIcon}
              color="#CAEB00"
            />
            {/* <NavbarItem
              href="https://gnars.com"
              text="Gnars"
              icon={LinkIcon}
              color="#EA8C3F"
            /> */}
            <NavbarItem
              href="https://nounspace.com/s/gnars"
              text="Farcaster"
              icon={FarcasterIcon}
              color="#CA6CFF"
            />
          </div>
        </div>
      </div>

      {/* Treasure box at the bottom */}
      <div className="mt-auto">
        <TreasureBoxItem />
      </div>
    </div>
  );
}


interface NavbarItemProps {
  text: string;
  href: string;
  icon: React.ElementType;
  className?: string;
  color: string;
}

function NavbarItem(props: NavbarItemProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const pagePath = router.asPath;
  const active =
    (props.href.length > 2
      ? pagePath.startsWith(props.href)
      : pagePath === props.href) || isHovered;

  useEffect(() => {
    setIsHovered(false);
  }, []);

  return (
    <Link
      href={props.href}
      className={clsx("flex gap-2 items-center", props.className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={clsx(
          "p-2 rounded-lg",
          active
            ? "bg-opacity-100 scale-105"
            : "bg-gray-200 hover:bg-opacity-80"
        )}
        style={{ backgroundColor: active ? props.color : undefined }}
      >
        <props.icon width={"18px"} height={"18px"} color={active ? "white" : "black"} />
      </div>
      <p>{props.text}</p>
    </Link>
  );
}

function TreasureBoxItem() {
  const [treasureBalance, setTreasureBalance] = useState(0);

  useEffect(() => {
    async function fetchTreasureBalance() {
      try {
        const response = await fetch('/api/treasury/' + DAO_ADDRESS.treasury);
        const data: { tokens: TokenData[] } = await response.json();
        console.log({data})
        // setTreasureBalance(data.totalBalance);
      } catch (error) {
        console.error("Failed to fetch treasure balance:", error);
      }
    }

    fetchTreasureBalance();
  }, []);

  return (
    <Link href={"/treasure"}>
      <div className="border border-gray-300 rounded-md p-1 text-center">
        <div>
          <span className="text-lg">Treasure</span>
        </div>
        <hr />
        <div>
          <span className="text-lg">{treasureBalance.toFixed(2)} USD</span>
        </div>
      </div>
    </Link>
  );
}

export default Navbar;