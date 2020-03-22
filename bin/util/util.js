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
