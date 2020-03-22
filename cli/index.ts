#!/usr/bin/env node

import clear from 'clear';
import figlet from 'figlet';
import program from 'commander';
import {docs} from './cmds/docs'

clear();
console.log(figlet.textSync('Directus Toolkit', {horizontalLayout: 'full', font: 'Doom'} ));

program
  .version('0.0.1')
  .description("Do some cool stuff and save some time developing with directus!")
  .command("docs [folder]").description('Do the Docs!').action(docs)
  .parse(process.argv);