import { formatUnits } from "viem";
import { BASE_USDC_TOKEN_ADDRESS, BASE_SENDIT_TOKEN_ADDRESS } from "constants/gnarsDao";

const TokenValueRender = ({ address, value }: { address: string; value: bigint }) => {
    if (address === BASE_USDC_TOKEN_ADDRESS) {
        return (
            <div className="flex items-center gap-1">
                <span>$</span>
                <span>{formatUnits(value, 6)}</span>
            </div>
        );
    } else if (address === BASE_SENDIT_TOKEN_ADDRESS) {
        return (
            <div className="flex items-center gap-1">
                <span>↗</span>
                <span>{formatUnits(value, 14)}</span>
            </div>
        );
    }
    return null;
};

export default TokenValueRender;
