export const debounce = (func: () => void, delay: number) => {
    const timeoutId = setTimeout(func, delay);
    return () => clearTimeout(timeoutId);
};