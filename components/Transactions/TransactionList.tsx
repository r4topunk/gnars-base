import { FieldArray } from "formik";
import TransactionItem from "./TransactionItem";
import TransactionTypeSelectorModal from "../Modals/TransactionTypeSelectorModal";
import { useState } from "react";

const TransactionList = ({ values }: { values: any }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <FieldArray
            name="transactions"
            render={(arrayHelpers) => (
                <div className="mt-2">
                    {values.transactions.map((_: any, index: number) => (
                        <TransactionItem
                            key={index}
                            index={index}
                            arrayHelpers={arrayHelpers}
                        />
                    ))}

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-skin-muted text-skin-muted rounded-lg text-md w-full h-12 flex items-center justify-around border border-skin-muted"
                    >
                        Add Transaction
                    </button>

                    {isModalOpen && (
                        <TransactionTypeSelectorModal
                            onClose={() => setIsModalOpen(false)}
                            arrayHelpers={arrayHelpers}
                        />
                    )}

                    <div className="mt-6 text-sm text-skin-muted">
                        Add one or more transactions and describe your proposal for the community. The proposal cannot be modified after submission, so please verify all information before submitting.
                    </div>
                </div>
            )}
        />
    );
};

export default TransactionList;