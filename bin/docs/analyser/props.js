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
var util_1 = require("../../util/util");
var PropsAnalyser = /** @class */ (function (_super) {
    __extends(PropsAnalyser, _super);
    function PropsAnalyser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PropsAnalyser.prototype.read = function () {
        this.moduleKey = "Prop";
        var table = new table_1.default('Props', ['Prop', 'Description', 'Default', 'Type'], []);
        var section = this.getSection('script', /(\r|\n|\t)/g);
        if (!section) {
            return table;
        }
        var prop = "", options = "", depth = 0;
        var i = section.indexOf('props:') + 5;
        while (section.charAt(i) != '{') {
            i++;
        }
        for (i; i < section.length; i++) {
            var c = section.charAt(i);
            if (depth == 1)
                prop += c;
            if (depth > 1 && c != '}')
                options += c;
            if (c == '{')
                depth++;
            if (c == '}') {
                depth--;
                if (depth == 1) {
                    table.updateRowByObject(this.propToOptions(prop, options), 'Prop');
                    prop = "";
                    options = "";
                }
            }
            if (depth == 0)
                break;
        }
        return table;
    };
    PropsAnalyser.prototype.propToOptions = function (prop, optionsString) {
        prop = prop.replace(/(\s|:|{|}|'|,)/gm, '');
        prop = util_1.wrapText(util_1.camelToSnake(prop), '`');
        var options = { Prop: prop };
        optionsString.split(',').forEach(function (option) {
            var _a = option.split(': '), name = _a[0], value = _a[1];
            if (name == 'required' && value == 'true') {
                options.Prop += '*';
            }
            else {
                name = name.replace(/^./, function (g) { return g.toUpperCase(); });
                options[name] = util_1.wrapText(value, '`');
            }
        });
        return options;
    };
    return PropsAnalyser;
}(analyser_1.default));
exports.default = PropsAnalyser;
