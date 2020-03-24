"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var table_1 = __importDefault(require("./table"));
var ModuleAnalyzer = /** @class */ (function () {
    function ModuleAnalyzer(file, moduleName) {
        this.moduleKey = "";
        this.file = file;
        this.moduleName = moduleName;
        this.moduleTable = this.read();
    }
    ModuleAnalyzer.prototype.read = function () {
        return new table_1.default('', [], []);
    };
    ModuleAnalyzer.prototype.merge = function (readme) {
        var readmeTable = table_1.default.getTable(readme, this.moduleTable.name) || this.moduleTable;
        if (readmeTable.isEmpty())
            return readme;
        if (readmeTable != this.moduleTable)
            readmeTable.merge(this.moduleTable, this.moduleKey);
        return readmeTable.replaceInReadme(readme);
    };
    ModuleAnalyzer.prototype.getSection = function (section, ignore) {
        var formattedfile = this.file.replace(ignore, '');
        var match = formattedfile.match(new RegExp("<" + section + ".*?>(.|\\s)*?</" + section + ".*?>", 'gm'));
        if (match)
            return match[0];
        return null;
    };
    return ModuleAnalyzer;
}());
exports.default = ModuleAnalyzer;
