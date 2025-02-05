export const isValidUrl = (url: string): boolean => {
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // Protocol
        '((([a-zA-Z0-9_-]+)\\.)+[a-zA-Z]{2,})' + // Domain name
        '(\\:[0-9]{1,5})?' + // Port
        '(\\/.*)?$', // Path
        'i'
    );
    return !!urlPattern.test(url);
};
