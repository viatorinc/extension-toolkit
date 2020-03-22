"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var util_1 = require("../util/util");
var table_1 = __importDefault(require("../util/table"));
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
function createDocs(folder, element) {
    var folderLocation = path_1.default.join('src', folder, element);
    var vueFile = path_1.default.join(folderLocation, element + '.vue');
    var readmeFile = path_1.default.join(folderLocation, 'readme.md');
    if (!fs_1.default.existsSync(vueFile)) {
        return console.log("No Element detected: ", element);
    }
    var file = fs_1.default.readFileSync(vueFile).toString('utf8');
    file = file.replace(/(\r|\n|\t)/g, ''); // remove any whitespace character exept space
    var section = getSection(file, 'script');
    if (!section)
        return;
    var props = getProps(section);
    if (!fs_1.default.existsSync(readmeFile)) {
        fs_1.default.mkdirSync(readmeFile);
        console.log("Created Readme for: ", element, " at ", readmeFile);
    }
    var readme = fs_1.default.readFileSync(readmeFile).toString('utf8');
    readme = readme.replace(/(\r|\t)/g, '');
    var table = table_1.default.getTable(readme, 'Props');
    if (table) {
        table.generateTableString();
        table.updateColumn('Type');
        Object.entries(props).forEach(function (entry) {
            var required = entry[1].required || 'false';
            var prop = '`' + util_1.camelToSnake(entry[0]) + '`';
            if (required == 'true')
                prop += '*';
            var def = entry[1].default || '';
            def = '`' + def + '`';
            var type = entry[1].type || '';
            table.updateRow([prop, '', def, type]);
        });
        table.generateTableString();
    }
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
        var o = option.split(':');
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
