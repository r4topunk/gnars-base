// components/DAO/Transactions/SkeletonTransaction.tsx
import React from "react";

const Skeleton = () => {
    return (
        <div className="transaction-card">
            {/* Header */}
            <div className="transaction-header bg-[#FF5733] dark:bg-[#C70039] animate-pulse"></div>

            {/* Content */}
            <div className="transaction-content p-4">
                {/* Value Placeholder */}
                <div className="transaction-detail flex gap-2 mb-2">
                    <span className="font-semibold bg-gray-300 dark:bg-gray-600 animate-pulse h-4 w-16 rounded"></span>
                    <div className="bg-gray-300 dark:bg-gray-600 animate-pulse h-4 w-24 rounded"></div>
                </div>

                {/* To Placeholder */}
                <div className="transaction-detail flex gap-2">
                    <span className="font-semibold bg-gray-300 dark:bg-gray-600 animate-pulse h-4 w-16 rounded"></span>
                    <div className="bg-gray-300 dark:bg-gray-600 animate-pulse h-4 w-32 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
