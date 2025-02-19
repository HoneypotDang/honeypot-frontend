export const getHash = (url?: string) => {
    return (url || window.location.hash)?.split('#')?.[1]
}