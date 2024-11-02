import { Address } from "viem";
import useEnsName from "@/hooks/fetch/useEnsName";
import { shortenAddress } from "@/utils/shortenAddress";
import Link from "next/link";
import { ETHERSCAN_BASEURL } from "constants/urls";
import UserAvatar from "@/components/UserAvatar";
import { ethers } from "ethers";
const FormatedTransactionValue = ({ address }: { address: Address }) => {
    const { data: ensName } = useEnsName(address);
    console.log("FormatedTransactionValue", { address }, { ensName });
    if (ensName?.ensName) {
        return (
            <div className="flex items-center">
                <UserAvatar address={address} className="rounded-full" diameter={18} />
                <p className="ml-2">{ensName.ensName || shortenAddress(address, 4)}</p>
            </div>
        );
    }

    if (ethers.utils.isAddress(address)) {
        return (
            <Link href={`${ETHERSCAN_BASEURL}/address/${address}`} rel="noopener noreferrer" target="_blank">
                {shortenAddress(address, 4)}
            </Link>
        );
    }

    return <span>{address}</span>;
};

export default FormatedTransactionValue;
