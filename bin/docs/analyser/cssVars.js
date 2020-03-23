"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var analyser_1 = __importDefault(require("../analyser"));
var table_1 = __importDefault(require("../table"));
var CssAnalyser = /** @class */ (function (_super) {
    __extends(CssAnalyser, _super);
    function CssAnalyser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CssAnalyser.prototype.read = function () {
        this.moduleKey = 'Variable';
        var table = new table_1.default('CSS Variables', ['Variable', 'Default'], []);
        var section = this.getSection('script', /a^/);
        if (!section)
            return table;
        var cssVars = section.match(new RegExp("^\t?(--" + this.moduleName + ".*?: .*?;)+?", 'gm'));
        if (!cssVars)
            return table;
        cssVars.forEach(function (variable) {
            var _a = variable.replace(/(\t|;)/g, '').split(': '), name = _a[0], value = _a[1];
            table.updateRowByObject({
                Variable: name,
                Default: value
            }, 'Variable');
        });
        return table;
    };
    return CssAnalyser;
}(analyser_1.default));
exports.default = CssAnalyser;
