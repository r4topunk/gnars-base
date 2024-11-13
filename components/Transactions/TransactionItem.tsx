import { Field, FieldArrayRenderProps, useFormikContext } from "formik";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { FormTransaction } from "../SubmitButton";

const TransactionItem = ({
    index,
    arrayHelpers,
}: {
    index: number;
    arrayHelpers: FieldArrayRenderProps;
}) => {
    // Access form values using useFormikContext
    const { values } = useFormikContext<{ transactions: FormTransaction[] }>(); // Type your form values accordingly

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
                placeholder="0x04bf..."
                className="bg-gray-100 dark:bg-opacity-5 text-skin-base placeholder:text-gray-500 px-3 py-3 rounded-lg w-full text-md mt-2 focus:outline-none"
            />
            <label className="text-sm mt-4">Value</label>
            <div className="flex items-center mt-2">
                <Field
                    name={`transactions[${index}].value`}
                    placeholder={values.transactions[index].transactionType === "USDC" ? "100 (USDC)" : "0.1 (ETH)"}
                    type="number"
                    className="bg-gray-100 dark:bg-opacity-5 text-skin-base placeholder:text-gray-500 px-3 py-3 rounded-l-lg w-full text-md focus:outline-none"
                />
                <label className="bg-gray-100 dark:bg-opacity-5 rounded-r-lg h-12 flex items-center border-l px-4">
                    {values.transactions[index].transactionType}
                </label>
            </div>

            <div className="flex justify-end mt-2">
                <button
                    type="button"
                    className="text-blue-500 underline"
                    onClick={() =>
                        arrayHelpers.replace(index, {
                            ...values.transactions[index],
                            transactionType: values.transactions[index].transactionType === "USDC" ? "ETH" : "USDC"
                        })
                    }
                >
                    {values.transactions[index].transactionType === "USDC" ? "Switch to ETH" : "Switch to USDC"}
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;
