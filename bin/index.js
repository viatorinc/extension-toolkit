#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var clear_1 = __importDefault(require("clear"));
var figlet_1 = __importDefault(require("figlet"));
var commander_1 = __importDefault(require("commander"));
var docs_1 = require("./cmds/docs");
clear_1.default();
console.log(figlet_1.default.textSync('Toolkit', { horizontalLayout: 'full', font: 'Doom' }));
commander_1.default
    .version('0.0.1')
    .description("Do some cool stuff and save some time developing with directus!")
    .command("docs").arguments("<folders>").description('Do the Docs!').action(docs_1.docs);
commander_1.default.parse(process.argv);
