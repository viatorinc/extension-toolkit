#!/usr/bin/env node
var join = require('path').join;

const argv = require('yargs').commandDir('./cmds').demandCommand()
  .help()
  .epilogue("✨🐰✨")
  .argv;


  
