"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Table = /** @class */ (function () {
    function Table(name, columns, rows) {
        this.columnSizes = [];
        this.columns = columns;
        this.rows = rows;
        this.name = name;
        this.calcColumnSizes();
    }
    Table.prototype.updateColumn = function (column, values) {
        var _this = this;
        if (values === void 0) { values = []; }
        if (this.columns.includes(column)) {
            var index_1 = this.columns.findIndex(function (title) { return title == column; });
            values.forEach(function (value, i) {
                if (i < _this.rows.length && value != '')
                    _this.rows[i][index_1] = value;
            });
        }
        else {
            this.columns.push(column);
            this.rows.forEach(function (row, index) {
                if (index < values.length)
                    row.push(values[index] || '');
                else
                    row.push('');
            });
        }
        this.calcColumnSizes();
    };
    Table.prototype.updateRow = function (newRow) {
        var index = this.rows.findIndex(function (row) { return row[0] == newRow[0]; });
        if (index != -1) {
            this.rows[index] = this.rows[index].map(function (field, i) { return newRow[i] == '' ? field : newRow[i]; });
        }
        else {
            this.rows.push(newRow);
        }
        this.calcColumnSizes();
    };
    Table.prototype.generateTableString = function () {
        var _this = this;
        var tableString = "## " + this.name + "\n";
        var table = __spreadArrays([this.columns, this.columnSizes.map(function (size) { return "-".repeat(size + 2); })], this.rows);
        table.forEach(function (row, rowIndex) {
            row.forEach(function (field, index) {
                if (rowIndex == 1) {
                    tableString += "|" + field;
                    tableString += " ".repeat(_this.columnSizes[index] - field.length + 2);
                }
                else {
                    tableString += "| " + field;
                    tableString += " ".repeat(_this.columnSizes[index] - field.length + 1);
                }
            });
            tableString += "|\n";
        });
        console.log(tableString);
        return tableString;
    };
    Table.prototype.calcColumnSizes = function () {
        var _this = this;
        var tableTransposed = this.columns.map(function (col, i) { return __spreadArrays([_this.columns], _this.rows).map(function (row) { return row[i].length; }); });
        this.columnSizes = tableTransposed.map(function (column) { return Math.max.apply(Math, column); });
    };
    Table.getTable = function (text, name) {
        var table = text.match(new RegExp("## " + name + "\\s\\|(.*?\\|\\s\\|.*?){1,}\\|\\n", 'm'));
        var tableString = "";
        if (!table) {
            console.log("No Table detected");
            return null;
        }
        else {
            tableString = tableString[0];
        }
        var lines = tableString.replace(/\n$/g, '').split('\n'); // remove last newline and split at each other newline
        var columns = lines[1].replace(/(^\||\|$)/g, '').split('|').map(function (column) { return column.replace(/\s+/g, ' ').replace(/(^ | $)/g, ''); });
        var rows = [];
        for (var i = 3; i < lines.length; i++) {
            var fields = lines[i].replace(/(^\||\|$)/g, '').split('|').map(function (column) { return column.replace(/\s+/g, ' ').replace(/(^ | $)/g, ''); });
            rows.push(fields);
        }
        return new Table(name, columns, rows);
    };
    return Table;
}());
exports.default = Table;
