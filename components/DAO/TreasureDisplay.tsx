import { useDAOAddresses, useTreasuryBalance } from "@/hooks/fetch";
import { useCurrentThreshold } from "@/hooks/fetch/useCurrentThreshold";
import { useUserVotes } from "@/hooks/fetch/useUserVotes";
import { TOKEN_CONTRACT } from "constants/addresses";
import { BigNumber } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBalance } from "wagmi";


function formatTreasuryTotal(value: number): string {
    return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toFixed(2);
}
// Function to format token values
function formatTokenValue(tokenName: string, value: number): string {
    switch (tokenName) {
        case "USD Coin":
            return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : `${Math.round(value)}`; // Show thousands as "65.2K"
        case "Sendit":
            return value >= 1_000_000 ? `${(value / 1_000_000).toFixed(0)}M` : `${Math.round(value / 1000)}K`; // Show millions as "788M"
        case "Wrapped Ether": // Ethereum (from `wagmi`)
            return `${value.toFixed(3)} `;

        default:
            return value.toString();
    }
}

export const TreasureDisplay = () => {
    const { data: addresses } = useDAOAddresses({
        tokenContract: TOKEN_CONTRACT,
    });
    const { data: treasuryBalance } = useTreasuryBalance({
        treasuryContract: addresses?.treasury,
    });
    const { data: userVotes } = useUserVotes();
    const { data: currentThreshold } = useCurrentThreshold({
        governorContract: addresses?.governor,
    });
    const { data: ethBalance } = useBalance({
        address: '0x72ad986ebac0246d2b3c565ab2a1ce3a14ce6f88',
    });
    const [ethPrice, setEthPrice] = useState<number | null>(null);


    useEffect(() => {
        // Fetch Ethereum price from CoinGecko
        const fetchEthPrice = async () => {
            try {
                const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
                const data = await res.json();
                setEthPrice(data.ethereum.usd);
            } catch (error) {
                console.error("Error fetching Ethereum price:", error);
            }
        };

        fetchEthPrice();
    }, []);

    return (

        <div className="border border-skin-stroke rounded-2xl py-6 px-6 mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between">
            {/* Left side: Treasury title and formatted total balance */}
            <div className="flex flex-col gap-2">
                <div className="font-heading text-center text-2xl text-skin-muted">Treasury</div>
                <div className="font-bold text-4xl text-center">{treasuryBalance ? formatTreasuryTotal(treasuryBalance.totalBalance) : "0"}</div>
            </div>

            {/* Center: Tokens display stacked vertically */}
            <div className="mt-4 sm:mt-0 flex flex-col gap-2 sm:ml-8">
                {ethBalance && (
                    <div className="text-base flex items-center">
                        {Number(ethBalance.formatted).toFixed(2)}
                        <Image width={16} height={16} src="/eth_logo.png" alt="ETH Logo" className="w-6 h-6 ml-3 mr-2 object-contain" />
                        <div className="text-gray-400">
                            ~ (
                            {ethPrice !== null ? (
                                " " + formatTreasuryTotal((Number(ethBalance.formatted) * ethPrice)) + " USD"
                            ) : (
                                <div className="loader ml-2"></div>
                            )}
                            )
                        </div>
                    </div>
                )}

                {treasuryBalance?.tokens ? (
                    treasuryBalance.tokens
                        .sort((a: { token: { balanceUSD: number; }; }, b: { token: { balanceUSD: number; }; }) => b.token.balanceUSD - a.token.balanceUSD)
                        .map((tokenData: { token: any; }) => {
                            const token = tokenData.token;
                            const balance = BigNumber.isBigNumber(token.balance) ? token.balance.toNumber() : token.balance;
                            const tokenLogoMap: { [key: string]: string } = {
                                "USD Coin": "/usdc-logo.png",
                                "Sendit": "https://assets.coingecko.com/coins/images/36789/large/Sendit-token-logo.png?1712416889",
                                "Wrapped Ether": "https://s2.coinmarketcap.com/static/img/coins/200x200/2396.png",
                            };
                            return (
                                <div key={token.address} className="text-base flex items-center">
                                    {formatTokenValue(token.name, balance)}
                                    <Image width={16} height={16} src={tokenLogoMap[token.name] || "/logo.png"} alt={`${token.name} Logo`} className="w-6 h-6 ml-2 mr-2 rounded-full" />
                                    <div className="text-gray-400">
                                        ~ ( {formatTreasuryTotal(token.balanceUSD)} USD )
                                    </div>
                                </div>
                            );
                        })
                ) : (
                    <div className="text-base">Loading treasury data...</div>
                )}
            </div>

            {/* Right side: Treasury description */}
            <div className="sm:w-1/3 mt-4 sm:mt-0 sm:border-l border-skin-stroke sm:pl-6 text-skin-muted">
                This treasury exists for DAO participants to allocate resources for the long-term growth and prosperity of the project.
            </div>
        </div>
    )
}

export default TreasureDisplay;