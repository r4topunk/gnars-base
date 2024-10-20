import { Field } from "formik";
import { XMarkIcon } from "@heroicons/react/20/solid";

const TransactionItem = ({
    index,
    arrayHelpers,
}: {
    index: number;
    arrayHelpers: any;
}) => {
    return (
        <div className="mb-4 border p-4 rounded-md flex flex-col">
            <div className="flex items-center justify-between">
                <label className="text-sm w-52">Recipient</label>
                <button onClick={() => arrayHelpers.remove(index)}>
                    <XMarkIcon className="h-6" />
                </button>
            </div>
            <Field
                name={`transactions[${index}].address`}
                placeholder="0x04bfb0034F24E..."
                className="bg-skin-muted text-skin-base placeholder:text-skin-muted px-3 py-3 rounded-lg w-full text-md mt-2 focus:outline-none"
            />
            <label className="text-sm mt-4">Value</label>
            <div className="flex items-center mt-2">
                <Field
                    name={`transactions[${index}].valueInETH`}
                    placeholder="0.1"
                    type="number"
                    className="bg-skin-muted text-skin-base placeholder:text-skin-muted px-3 py-3 rounded-l-lg w-full text-md focus:outline-none"
                />
                <label className="bg-skin-muted h-12 flex items-center border-l px-4">
                    ETH
                </label>
            </div>
        </div>
    );
};

export default TransactionItem;
import { type } from "os";
