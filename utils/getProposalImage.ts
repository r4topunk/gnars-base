// Function to extract image URLs from markdown descriptions
export const extractImageUrl = (description: string): string | null => {
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = description.match(imageRegex);
    return match ? match[1] : null;
};