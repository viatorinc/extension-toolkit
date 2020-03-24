"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function camelToSnake(name) {
    return name.replace(/([A-Z0-9])/g, function (group) { return "-" + group.toLowerCase(); });
}
exports.camelToSnake = camelToSnake;
function wrapText(text, wrapper) {
    return wrapper + text + wrapper;
}
exports.wrapText = wrapText;
function createHeader(title, length) {
    var left = Math.floor((length - title.length) / 2 + 4);
    var right = Math.ceil((length - title.length) / 2 + 4);
    left = left < 2 ? 2 : left;
    right = right < 2 ? 2 : right;
    return "-".repeat(left) + "[ " + title + " ]" + "-".repeat(right);
}
exports.createHeader = createHeader;
