"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var table_1 = __importDefault(require("./table"));
var merge_1 = require("./merge");
exports.docs = function (folders) {
    var allowedFolders = ['all', 'interfaces', 'components'];
    if (allowedFolders.includes(folders) == false) {
        return console.log("Invalid folder!");
    }
    allowedFolders.shift();
    var folderList = folders == 'all' ? allowedFolders : [folders];
    folderList.forEach(function (folder) {
        var elements = fs_1.default.readdirSync('./src/' + folder).filter(function (dir) { return !dir.match(/\..*?$/); });
        elements.forEach(function (element) { return createDocs(folder, element); });
    });
};
function createDocs(folder, elementName) {
    var folderLocation = path_1.default.join('src', folder, elementName);
    var vueFile = path_1.default.join(folderLocation, elementName + '.vue');
    var readmeFile = path_1.default.join(folderLocation, 'readme.md');
    var newReadmeFile = path_1.default.join(folderLocation, 'new-readme.md');
    if (!fs_1.default.existsSync(vueFile)) {
        return console.log("No Element detected: ", elementName);
    }
    var file = fs_1.default.readFileSync(vueFile).toString('utf8');
    var script = getSection(file.replace(/(\r|\n|\t)/g, ''), 'script'); // remove any whitespace character exept space
    if (!script)
        return;
    var props = getProps(script);
    var css = getSection(file, 'style');
    if (!css)
        return;
    var cssVars = getCssVars(css, elementName);
    if (!fs_1.default.existsSync(readmeFile)) {
        fs_1.default.mkdirSync(readmeFile);
        console.log("Created Readme for: ", elementName, " at ", readmeFile);
    }
    var readme = fs_1.default.readFileSync(readmeFile).toString('utf8');
    readme = readme.replace(/(\r)/g, '');
    var propsTable = table_1.default.getTable(readme, 'Props') || new table_1.default('Props', ['Prop', 'Description', 'Default', 'Type'], []);
    merge_1.mergeProps(propsTable, props);
    readme = replaceTable(readme, 'Props', propsTable);
    var cssVarTable = table_1.default.getTable(readme, 'CSS Variables') || new table_1.default('CSS Variables', ['Variable', 'Default'], []);
    merge_1.mergeCssVars(cssVarTable, cssVars);
    readme = replaceTable(readme, 'CSS Variables', cssVarTable);
    if (fs_1.default.existsSync(newReadmeFile)) {
        fs_1.default.unlinkSync(newReadmeFile);
    }
    var changes = [];
    if (propsTable.changed)
        changes.push("Props");
    if (cssVarTable.changed)
        changes.push("CSS Variables");
    if (changes.length > 0)
        console.log(elementName + ": Changes for " + changes.join(', '));
    fs_1.default.writeFileSync(newReadmeFile, readme);
}
function replaceTable(readme, name, newTable) {
    var regex = new RegExp("## " + name + "\\s\\|(.*?\\|\\s\\|.*?){1,}\\|(\\n|$)", 'm');
    var match = readme.match(regex);
    if (match) {
        readme = readme.replace(regex, newTable.generateTableString());
    }
    else {
        readme += "\n" + newTable.generateTableString();
    }
    return readme;
}
function getCssVars(section, elementName) {
    var cssVarsObject = {};
    var cssVars = section.match(new RegExp("^\t?(--" + elementName + ".*?: .*?;)+?", 'gm'));
    if (!cssVars)
        return cssVarsObject;
    cssVars.forEach(function (variable) {
        var _a = variable.replace(/(\t|;)/g, '').split(': '), key = _a[0], value = _a[1];
        cssVarsObject[key] = value;
    });
    return cssVarsObject;
}
function getProps(section) {
    var props = {}, key = "", prop = "", depth = 0;
    var i = section.indexOf('props:') + 5;
    while (section.charAt(i) != '{') {
        i++;
    }
    for (i; i < section.length; i++) {
        var c = section.charAt(i);
        if (depth == 1)
            key += c;
        if (depth > 1 && c != '}')
            prop += c;
        if (c == '{')
            depth++;
        if (c == '}') {
            depth--;
            if (depth == 1) {
                props[key.replace(/(\s|:|{|}|'|,)/gm, '')] = propOptionsToObject(prop);
                key = "";
                prop = "";
            }
        }
        if (depth == 0)
            break;
    }
    return props;
}
function propOptionsToObject(prop) {
    var options = {};
    prop.split(',').forEach(function (option) {
        var o = option.split(': ');
        options[o[0]] = o[1];
    });
    return options;
}
function getSection(text, name) {
    var match = text.match(new RegExp("<" + name + ".*?>(.|\\s)*?</" + name + ".*?>", 'gm'));
    if (match)
        return match[0];
    return null;
}
