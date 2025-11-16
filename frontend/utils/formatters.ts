export const shortenAddress = (address: string, chars = 4): string => {
    if (!address) return '';
    if (address.length <= chars * 2 + 2) return address; // No need to shorten if already short
    return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

export const formatLargeNumber = (value: number, decimals = 2): string => {
    if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(decimals)}T`;
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(decimals)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(decimals)}M`;
    return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};
