"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util/util");
function mergeCssVars(cssVarTable, cssVars) {
    cssVarTable.updateColumn('Variable');
    cssVarTable.updateColumn('Default');
    Object.entries(cssVars).forEach(function (entry) {
        var variable = entry[0], def = entry[1];
        cssVarTable.updateRowByObject({
            Variable: util_1.wrapText(variable, '`'),
            Default: util_1.wrapText(def, '`')
        }, 'Variable');
    });
    cssVarTable.hideNoneExistingRows(Object.keys(cssVars).map(function (cssVar) { return util_1.wrapText(cssVar, '`'); }));
    return cssVarTable;
}
exports.mergeCssVars = mergeCssVars;
function mergeProps(propsTable, props) {
    propsTable.updateColumn('Prop');
    propsTable.updateColumn('Description');
    propsTable.updateColumn('Default');
    propsTable.updateColumn('Type');
    Object.entries(props).forEach(function (entry) {
        var required = entry[1].required || 'false';
        var prop = util_1.wrapText(util_1.camelToSnake(entry[0]), '`');
        if (required == 'true')
            prop += '*';
        var def = entry[1].default || '';
        var type = entry[1].type || '';
        propsTable.updateRowByObject({
            Prop: prop,
            Default: util_1.wrapText(def, '`'),
            Type: util_1.wrapText(type, '`')
        }, 'Prop');
    });
    propsTable.hideNoneExistingRows(Object.keys(props).map(function (prop) {
        var propFormattet = util_1.wrapText(util_1.camelToSnake(prop), '`');
        if (props[prop].required)
            propFormattet += '*';
        return propFormattet;
    }));
    return propsTable;
}
exports.mergeProps = mergeProps;
