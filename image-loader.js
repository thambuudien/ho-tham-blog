export default ({ src, width }) => {
    // Check if the URL is external and starts with https://
    if (src.startsWith('https://')) {
        // Strip 'https://' from the beginning of the URL
        const imageUrl = src.substring(8);
        return `https://i0.wp.com/${imageUrl}?fit=${width}%2C${width}&ssl=1`;
    }
    // For local images or other cases, return the original src
    return src;
};