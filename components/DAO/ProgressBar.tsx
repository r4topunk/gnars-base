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
            textColor = "text-skin-proposal-success";
            baseColor = "bg-skin-proposal-success";
            bgColor = "bg-skin-proposal-success bg-opacity-10";
            break;
        case "danger":
            textColor = "text-skin-proposal-danger";
            baseColor = "bg-skin-proposal-danger";
            bgColor = "bg-skin-proposal-danger bg-opacity-10";
            break;
        case "muted":
            textColor = "text-skin-proposal-muted";
            baseColor = "bg-skin-proposal-muted";
            bgColor = "bg-skin-proposal-muted bg-opacity-10";
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