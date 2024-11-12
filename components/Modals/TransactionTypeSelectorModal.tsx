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
            <div className="bg-white dark:bg-black p-8 rounded-xl shadow-lg relative z-[1100] w-96 h-96 text-skin-base dark:text-white border-2 border-black dark:border-yellow-200">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                >
                    <XMarkIcon className="h-6" />
                </button>
                <div className="text-2xl font-bold dark:text-yellow-200">Select Type</div>
                <div className="mt-4 space-y-2">
                    <button
                        onClick={() => {
                            arrayHelpers.push({ address: "", transactionType: "ETH" });
                            onClose();
                        }}
                        className="bg-skin-backdrop dark:bg-gray-700 hover:bg-skin-muted dark:hover:bg-gray-600 text-skin-muted dark:text-gray-300 rounded-xl py-2 w-full border border-skin-stroke dark:border-gray-600"
                    >
                        SEND ETH
                    </button>
                    <button
                        onClick={() => {
                            arrayHelpers.push({ address: "", transactionType: "USDC" });
                            onClose();
                        }}
                        className="bg-skin-backdrop dark:bg-gray-700 hover:bg-skin-muted dark:hover:bg-gray-600 text-skin-muted dark:text-gray-300 rounded-xl py-2 w-full border border-skin-stroke dark:border-gray-600"
                    >
                        SEND USDC
                    </button>
                    <button className="bg-skin-backdrop dark:bg-gray-700 hover:bg-skin-muted dark:hover:bg-gray-600 text-skin-muted dark:text-gray-300 rounded-xl py-2 w-full border border-skin-stroke dark:border-gray-600">
                        <div>SEND GNAR (SOON)</div>
                    </button>
                    <button className="bg-skin-backdrop dark:bg-gray-700 hover:bg-skin-muted dark:hover:bg-gray-600 text-skin-muted dark:text-gray-300 rounded-xl py-2 w-full border border-skin-stroke dark:border-gray-600">
                        <div>AIRDROP RANDOM GNAR (SOON)</div>
                    </button>
                    <button className="bg-skin-backdrop dark:bg-gray-700 hover:bg-skin-muted dark:hover:bg-gray-600 text-skin-muted dark:text-gray-300 rounded-xl py-2 w-full border border-skin-stroke dark:border-gray-600">
                        <div>DROPOSAL MINT</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTypeSelectorModal;
