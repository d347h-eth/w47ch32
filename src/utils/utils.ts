export function formatPrice(amount: number, decimals: number) {
    let price = amount / 10**decimals;
    return price.toFixed(4).toString();
}

export function truncateAddr(address: string) {
    return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

export function strExists(needle: string, haystack: string[]) {
    return haystack.findIndex(item => needle.toLowerCase() === item.toLowerCase()) !== -1;
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
