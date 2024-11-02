import { ReactNode } from "react";

const TransactionCardWrapper = ({ title, children }: { title: string; children: ReactNode }) => (
    <div className="w-full max-w-md flex flex-col gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden">
        <div className="bg-[#FF5733] dark:bg-[#C70039] text-white p-3 text-center font-semibold text-lg rounded-t-lg">
            {title}
        </div>
        <div className="flex flex-col p-5 text-gray-900 dark:text-gray-200 space-y-3">
            {children}
        </div>
    </div>
);

export default TransactionCardWrapper;
