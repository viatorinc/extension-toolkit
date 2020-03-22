export function camelToSnake(name: string): string {
    return name.replace(/([A-Z0-9])/g, (group) => "-"+group.toLowerCase())
}

export function wrapText(text: string, wrapper: string): string {
    return wrapper + text + wrapper
}
