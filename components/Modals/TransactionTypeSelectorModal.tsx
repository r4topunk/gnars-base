import { XMarkIcon } from "@heroicons/react/20/solid";
import { transactionType } from "viem";

const TransactionTypeSelectorModal = ({
    onClose,
    arrayHelpers,
}: {
    onClose: () => void;
    arrayHelpers: any;
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-md relative z-[1100] w-96 h-96">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-[1200]"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <div className="text-2xl font-bold text-skin-base">Select Type</div>
                <div className="mt-4">
                    <button
                        onClick={() => {
                            arrayHelpers.push({ address: "", valueInETH: 0 });
                            onClose(); // Close modal after adding
                        }}
                        className="bg-skin-muted text-skin-base rounded-lg text-md w-full h-12 flex items-center justify-around z-[1100] hover:bg-amber-500"
                    >
                        SEND ETH
                    </button>
                    <button
                        onClick={() => {
                            arrayHelpers.push({ address: "0x41CB654D1F47913ACAB158a8199191D160DAbe4A", valueInUSDC: 0, transactionType: "USDC" });
                            onClose(); // Close modal after adding
                        }}
                        className="bg-skin-muted text-skin-base rounded-lg text-md w-full h-12 flex items-center justify-around mt-2 z-[1100] hover:bg-amber-500"
                    >
                        SEND USDC
                    </button>
                    <button className="bg-skin-muted text-skin-base rounded-lg text-md w-full h-12 flex items-center justify-around mt-2 z-[1100] hover:bg-amber-500">
                        <div>SEND GNAR (SOON)</div>
                    </button>
                    <button className="bg-skin-muted text-skin-base rounded-lg text-md w-full h-12 flex items-center justify-around mt-2 z-[1100] hover:bg-amber-500">
                        <div>AIRDROP RANDOM GNAR (SOON)</div>
                    </button>
                    <button className="bg-skin-muted text-skin-base rounded-lg text-md w-full h-12 flex items-center justify-around mt-2 z-[1100] hover:bg-amber-500">
                        <div>DROPOSAL MINT</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTypeSelectorModal;
