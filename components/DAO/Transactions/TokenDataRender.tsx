import Image from "next/image";
import { BASE_USDC_TOKEN_ADDRESS, BASE_SENDIT_TOKEN_ADDRESS } from "constants/gnarsDao";

const TokenDataRender = ({ address }: { address: string }) => {
    if (address === BASE_USDC_TOKEN_ADDRESS) {
        return (
            <div className="flex items-center gap-1">
                <Image className="object-contain" width={16} height={16} src="/usdc-logo.png" alt="USDC logo" />
                <span>USDC</span>
            </div>
        );
    } else if (address === BASE_SENDIT_TOKEN_ADDRESS) {
        return (
            <div className="flex items-center gap-1">
                <Image className="object-contain" width={16} height={16} src="/sendit-logo.png" alt="Sendit logo" />
                <span>Sendit</span>
            </div>
        );
    }
    return null;
};

export default TokenDataRender;
