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
        this.hiddenRows = [];
        this.changed = false;
        this.columns = columns;
        this.rows = rows;
        this.name = name;
    }
    Table.prototype.updateColumn = function (column, values) {
        var _this = this;
        if (values === void 0) { values = []; }
        if (this.columns.includes(column)) {
            var index_1 = this.columns.findIndex(function (title) { return title == column; });
            values.forEach(function (value, i) {
                if (i < _this.rows.length && value != '') {
                    _this.rows[i][index_1] = value;
                    _this.changed = true;
                }
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
            this.changed = true;
        }
    };
    Table.prototype.updateRowByObject = function (newRow, keyColumn) {
        var _this = this;
        var column = this.columns.indexOf(keyColumn);
        if (column == -1)
            return;
        var row = this.rows.findIndex(function (row) { return row[column] == newRow[keyColumn]; });
        if (row != -1) {
            Object.entries(newRow).forEach(function (entry) {
                var key = entry[0], value = entry[1];
                var i = _this.columns.indexOf(key);
                if (i != -1 && value != '') {
                    _this.rows[row][i] = value;
                    _this.changed = true;
                }
            });
        }
        else {
            var newRowArray = [];
            for (var i = 0; i < this.columns.length; i++) {
                newRowArray.push('');
            }
            row = this.rows.length;
            this.rows.push(newRowArray);
            Object.entries(newRow).forEach(function (entry) {
                var key = entry[0], value = entry[1];
                var i = _this.columns.indexOf(key);
                if (i != -1) {
                    _this.rows[row][i] = value;
                }
            });
            this.changed = true;
        }
    };
    Table.prototype.updateRowByArray = function (newRow) {
        var _this = this;
        if (newRow.length != this.columns.length) {
            console.log("New row count doesn't match the size of the table. Expected " + this.columns.length + ", got " + newRow.length);
            return;
        }
        var index = this.rows.findIndex(function (row) { return row[0] == newRow[0]; });
        if (index != -1) {
            this.rows[index] = this.rows[index].map(function (field, i) {
                if (newRow[i] == '') {
                    return field;
                }
                else {
                    _this.changed = true;
                    return newRow[i];
                }
            });
        }
        else {
            this.rows.push(newRow);
        }
        this.changed = true;
    };
    Table.prototype.hideNoneExistingRows = function (existingRows) {
        var _this = this;
        this.hiddenRows = [];
        this.rows.forEach(function (row, index) {
            if (!existingRows.includes(row[0])) {
                _this.hiddenRows.push(index);
                _this.changed = true;
            }
        });
    };
    Table.prototype.merge = function (table, keyColumn) {
        var _this = this;
        table.columns.forEach(function (column) { return _this.updateColumn(column); });
        var columnIndex = this.columns.indexOf(keyColumn);
        table.rows.forEach(function (row) {
            var rowObject = {};
            row.forEach(function (field, index) { return rowObject[table.columns[index]] = field; });
            _this.updateRowByObject(rowObject, keyColumn);
        });
        this.hideNoneExistingRows(table.rows.map(function (row) { return row[columnIndex]; }));
    };
    Table.prototype.isEmpty = function () {
        return this.rows.length == 0;
    };
    Table.prototype.generateTableString = function () {
        var _this = this;
        this.calcColumnSizes();
        var tableString = "## " + this.name + "\n";
        var table = __spreadArrays([this.columns, this.columnSizes.map(function (size) { return "-".repeat(size + 2); })], this.rows);
        table.forEach(function (row, rowIndex) {
            var hidden = _this.hiddenRows.includes(rowIndex - 2) && rowIndex > 1;
            if (hidden)
                tableString += "<!-- "; // (rowIndex - 2) to accommodate for the header
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
            tableString += "|";
            if (hidden)
                tableString += " -->";
            tableString += "\n";
        });
        return tableString;
    };
    Table.prototype.calcColumnSizes = function () {
        var _this = this;
        var tableTransposed = this.columns.map(function (col, i) { return __spreadArrays([_this.columns], _this.rows).map(function (row) { return row[i].length; }); });
        this.columnSizes = tableTransposed.map(function (column) { return Math.max.apply(Math, column); });
    };
    Table.prototype.replaceInReadme = function (readme) {
        var regex = new RegExp("## " + this.name + "\\s*?\\|(.*?\\|\\s\\|.*?){1,}\\|(\\n|$)", 'm');
        var match = readme.match(regex);
        if (match) {
            readme = readme.replace(regex, this.generateTableString());
        }
        else {
            readme += "\n" + this.generateTableString();
        }
        return readme;
    };
    Table.getTable = function (text, name) {
        var table = text.match(new RegExp("## " + name + "\\s*?\\|(.*?\\|\\s\\|.*?){1,}\\|(\\n|$)", 'm'));
        var tableString = "";
        if (!table) {
            console.log("No Table with name " + name + " detected");
            return null;
        }
        else {
            tableString = table[0].replace(/^\s*/gm, '');
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
