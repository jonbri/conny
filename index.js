const { exec } = require('child_process');
const fs = require('fs');

const sInputDir = process.argv[2];
const sOutputDir = process.argv[3];
const bDryRun = process.argv[4] === 'true';

// A utility for converting a directory of files.
// For now, this assumes wav -> mp3

// first arg: input directory
// second arg: output directory
// third arg: "true" for --dry-run
if (process.argv.length <= 3) {
  console.log(`Usage: node ${__filename} path/to/input/dir path/to/already/created/output/dir [true]`);
  process.exit(-1);
}

fs.readdir(sInputDir, (err, aItems) => {
  aItems
    .filter(s => {
      return /\.wav$/.test(s);
    })
    .forEach(sItem => {
      const sInput = `${sInputDir}/${sItem}`;
      const sOutput = `${sOutputDir}/${sItem}`.replace(/\.wav$/, ".mp3");
      const sCommand = `ffmpeg -i "${sInput}" "${sOutput}"`;
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
