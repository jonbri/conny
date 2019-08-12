#!/usr/bin/env node
const getopt = require('node-getopt');
const { exec } = require('child_process');
const fs = require('fs');

let oArgs = getopt.create([
  ['', 'dry-run', 'Only show command'],
  ['h', 'help', 'display this help']
]).bindHelp().parseSystem();

let sInputDir = oArgs.argv[0];
let sOutputDir = oArgs.argv[1];

sInputDir = sInputDir.replace(/\/\//, '/');
sInputDir = sInputDir.replace(/\/$/, '');

sOutputDir = sOutputDir + "/" + sInputDir.split('/').reverse()[0];
sOutputDir = sOutputDir.replace(/\/\//, '/');

const bDryRun = oArgs.options['dry-run'] === true;

if (process.argv.length <= 3) {
  console.log(`Usage: node ${__filename} path/to/input/dir path/to/already/created/output/dir [true]`);
  process.exit(-1);
}

fs.readdir(sInputDir, (err, aItems) => {
  if (!aItems) {
    console.log(`${sInputDir} not read`);
    return;
  }

  // Is it a directory?
  try {
    fs.lstatSync(sOutputDir)
  } catch (e) {
    fs.mkdirSync(sOutputDir);
  }

  aItems
    .filter(s => {
      return /\.(wav|flac)$/.test(s);
    })
    .forEach(sItem => {
      let sInput = `${sInputDir}/${sItem}`;
      sInput = sInput.replace(/\/\//, '/');
      let sOutput = `${sOutputDir}/${sItem}`.replace(/\.(wav|flac)$/, ".mp3");
      sOutput = sOutput.replace(/\/\//, '/');
      const sCommand = `ffmpeg -y -i "${sInput}" "${sOutput}"`;
      console.log(sCommand);
      if (bDryRun === true) {
        return;
      }
      exec(sCommand, (err, stdout, stderr) => {
        if (err) {
          console.log(`error: ${err}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
    });
});
