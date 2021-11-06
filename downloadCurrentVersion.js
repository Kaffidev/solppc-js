#!/usr/bin/env node

// This is used to download the correct binary version
// as part of the prepublish step.

var fs = require('fs');
var https = require('follow-redirects').https;

function downloadBinary (outputName) {
  console.log('Downloading latest version...');

  // Remove if existing
  if (fs.existsSync(outputName)) {
    fs.unlinkSync(outputName);
  }

  process.on('SIGINT', function () {
    console.log('Interrupted, removing file.');
    fs.unlinkSync(outputName);
    process.exit(1);
  });

  var file = fs.createWriteStream(outputName, { encoding: 'binary' });
  https.get('github.com/vitelabs/soliditypp/releases/download/latest/soljson.js', function (response) {
    if (response.statusCode !== 200) {
      console.log('Error downloading file: ' + response.statusCode);
      process.exit(1);
    }
    response.pipe(file);
    file.on('finish', function () {
      file.close(function () {
        console.log('Done.');
      });
    });
  });
}

console.log('Downloading correct soliditypp binary...');

downloadBinary('soljson.js');