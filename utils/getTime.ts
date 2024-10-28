
export const getTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();

    return `${hours}:${minutes} ${date.getHours() >= 12 ? "PM" : "AM"}`;
};