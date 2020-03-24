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
var EventAnalyser = /** @class */ (function (_super) {
    __extends(EventAnalyser, _super);
    function EventAnalyser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventAnalyser.prototype.read = function () {
        this.moduleKey = 'Event';
        var table = new table_1.default('Events', ['Event', 'Description', 'Value'], []);
        var script = this.getSection('script', /(\r|\n|\t)/g) || '';
        var template = this.getSection('template', /(\r|\n|\t)/g) || '';
        if (script == '' && template == '')
            return table;
        var section = template + script;
        var emits = section.match(/emit\('.*?',.*?\)/g);
        if (!emits)
            return table;
        emits.forEach(function (emit) {
            var match = emit.match(/'.*?'/);
            if (match) {
                table.updateRowByObject({
                    Event: match[0].replace(/'/g, '`'),
                }, 'Event');
            }
        });
        return table;
    };
    return EventAnalyser;
}(analyser_1.default));
exports.default = EventAnalyser;
