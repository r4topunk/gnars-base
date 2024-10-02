import {
  HomeIcon,
  LightBulbIcon,
  LinkIcon,
  QueueListIcon,
  TableCellsIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useEffect,
  useState
} from "react";

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
              href="/#"
              text="Propdates"
              icon={TableCellsIcon}
              color="#CAEB00"
            />
            <NavbarItem
              href="https://gnars.com"
              text="Gnars"
              icon={LinkIcon}
              color="#EA8C3F"
            />
            <NavbarItem
              href="https://nounspace.com"
              text="Nounspace"
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
  return (
    <Link
      href={"/treasure"}
    >
      <div className="border border-gray-300 rounded-md p-1" style={{ textAlign: "center" }}>
        <div >
          <span className="text-lg">Treasure</span>
        </div>
        <hr />
        <div>
          <span className="text-lg">126,023 USD</span>
        </div>
      </div>
    </Link>
  );
}

export default Navbar;


function FarcasterIcon({width, height, color}: {width?: number, height?: number, color?: string}) {
  return (<svg width={width} height={height} viewBox={`0 0 1000 1000`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" fill={color} />
    <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" fill={color} />
    <path d="M675.556 746.667C663.282 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z" fill={color} />
  </svg>)
}