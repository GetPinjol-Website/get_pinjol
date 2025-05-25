export function parseUrl(path) {
    return path.toLowerCase().replace(/[^a-z0-9/]/g, '');
}