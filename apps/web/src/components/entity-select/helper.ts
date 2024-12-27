/**
 * Safe format json method
 */
export const safeJsonParse = (str: string) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
};
