export function camelToSnake(name: string): string {
    return name.replace(/([A-Z0-9])/g, (group) => "-"+group.toLowerCase())
}

export function snakeToCamel(name: string): string {
    return name.replace(/(-[a-z])/g, (group) => group.toUpperCase().replace('-', ''))
}

export function snakeToTitle(name: string): string {
    return name.replace(/(-[a-z])/g, (group) => group.toUpperCase().replace('-', ' '))
}

export function wrapText(text: string, wrapper: string): string {
    return wrapper + text + wrapper
}

export function createHeader(title: string, length: number) {
    let left = Math.floor((length - title.length) / 2 + 4)
    let right = Math.ceil((length - title.length) / 2 + 4)
    left = left < 2 ? 2 : left
    right = right < 2 ? 2 : right
    return "-".repeat(left) +"[ "+title+" ]"+"-".repeat(right)
}