#!/usr/bin/env node

import clear from 'clear';
import figlet from 'figlet';
import program from 'commander';
import {docs} from './docs/docs'

clear();
console.log(figlet.textSync('Toolkit', {horizontalLayout: 'full', font: 'Doom'} ));

program
  .version('0.0.1')
  .description("Do some cool stuff and save some time developing with directus!")
  .command("docs").arguments("<folders>").description('Do the Docs!').action(docs)
  
program.parse(process.argv);