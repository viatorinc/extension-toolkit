#!/usr/bin/env node

import clear from 'clear';
import figlet from 'figlet';
import program from 'commander';
import docs from './docs/docs'
import template from './templates/templates'

clear();
console.log(figlet.textSync('Toolkit', {horizontalLayout: 'full', font: 'Doom'} ));

program.version('0.0.1').description("Do some cool stuff and save some time developing with directus!")

program.command("docs").arguments("<type> [module]").description('Do the Docs!').action(docs)

program.command("template").arguments("<type> <name>").description('Create the Templates!').action(template)
  
program.parse(process.argv);