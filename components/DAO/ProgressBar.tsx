const ProgressBar = ({
    label,
    type,
    value,
    percentage,
}: {
    label: string;
    value: number;
    percentage: number;
    type: "success" | "danger" | "muted";
}) => {
    let textColor;
    let baseColor;
    let bgColor;

    switch (type) {
        case "success":
            textColor = "text-green-700 dark:text-green-400";
            baseColor = "bg-green-500 dark:bg-green-600";
            bgColor = "bg-green-100 dark:bg-green-800";
            break;
        case "danger":
            textColor = "text-red-700 dark:text-red-400";
            baseColor = "bg-red-500 dark:bg-red-600";
            bgColor = "bg-red-100 dark:bg-red-800";
            break;
        case "muted":
            textColor = "text-gray-700 dark:text-gray-400";
            baseColor = "bg-gray-400 dark:bg-gray-500";
            bgColor = "bg-gray-100 dark:bg-gray-800";
            break;
    }

    return (
        <div className="w-full">
            <div className="flex flex-col items-center sm:items-start sm:flex-row justify-between mb-1">
                <div className={`${textColor} font-heading text-xl`}>{label}</div>
                <div className="font-semibold text-xl mt-4 sm:mt-0 text-center sm:text-left">
                    {value}
                </div>
            </div>
            <div className={`w-full ${bgColor} rounded-full h-4 mt-4 sm:mt-0`}>
                <div
                    className={`${baseColor} h-4 rounded-full`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;


