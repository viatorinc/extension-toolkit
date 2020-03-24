"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var analyser_1 = __importDefault(require("./analyser"));
var util_1 = require("../util/util");
exports.docs = function (folders) {
    return __awaiter(this, void 0, void 0, function () {
        var allowedFolders, analysers, folderList, analyserFiles, i, analyser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allowedFolders = ['all', 'interfaces', 'components'];
                    analysers = [];
                    if (allowedFolders.includes(folders) == false) {
                        return [2 /*return*/, console.log("Invalid folder!")];
                    }
                    allowedFolders.shift();
                    folderList = folders == 'all' ? allowedFolders : [folders];
                    analyserFiles = fs_1.default.readdirSync(path_1.default.join(__dirname, 'analyser')).filter(function (dir) { return dir.match(/.*?\.js$/); });
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < analyserFiles.length)) return [3 /*break*/, 4];
                    analyser = analyserFiles[i];
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(path_1.default.join(__dirname, 'analyser', analyser))); })];
                case 2:
                    module = _a.sent();
                    Object.values(module).forEach(function (value) {
                        if (value instanceof Function && value.__proto__ == analyser_1.default) {
                            var analyser_2 = value;
                            analysers.push(analyser_2);
                        }
                    });
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    folderList.forEach(function (folder) {
                        var modules = fs_1.default.readdirSync('./src/' + folder).filter(function (dir) { return !dir.match(/\..*?$/); });
                        modules.forEach(function (module) {
                            console.log(util_1.createHeader(module, 36));
                            createDocs(folder, module, analysers);
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
};
function createDocs(folder, moduleName, analysers) {
    var folderLocation = path_1.default.join('src', folder, moduleName);
    var vueFile = path_1.default.join(folderLocation, moduleName + '.vue');
    var readmeFile = path_1.default.join(folderLocation, 'readme.md');
    var newReadmeFile = path_1.default.join(folderLocation, 'new-readme.md');
    if (!fs_1.default.existsSync(vueFile)) {
        return console.log("No Module detected!");
    }
    var file = fs_1.default.readFileSync(vueFile).toString('utf8');
    if (!fs_1.default.existsSync(readmeFile)) {
        fs_1.default.mkdirSync(readmeFile);
        console.log("Created Readme for: ", moduleName, " at ", readmeFile);
    }
    var readme = fs_1.default.readFileSync(readmeFile).toString('utf8');
    readme = readme.replace(/(\r)/g, '');
    var changes = [];
    analysers.forEach(function (analyserClass) {
        var analyser = new analyserClass(file, moduleName);
        readme = analyser.merge(readme);
        if (analyser.moduleTable.changed)
            changes.push(analyser.moduleTable.name);
    });
    if (fs_1.default.existsSync(newReadmeFile)) {
        fs_1.default.unlinkSync(newReadmeFile);
    }
    if (changes.length > 0)
        console.log(moduleName + ": Changes for " + changes.join(', '));
    fs_1.default.writeFileSync(newReadmeFile, readme);
}
