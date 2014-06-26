var fs = require('fs');

exports = module.exports = function(logFile) {
  var stream;
  if (logFile) {
    stream = fs.createWriteStream(logFile, { flags: 'a' });
    process.on('SIGHUP', function () {
        console.log("SIGHUP: Reopening logfile");
        stream.end();
        stream = fs.createWriteStream(logFile, { flags: 'a' });
        console.log("SIGHUP: Starting new log file");
      }
    );
  } else {
    stream = process.stdout;
  }
  return stream;
};
