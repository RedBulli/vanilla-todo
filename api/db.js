const stream = require('stream');
const fs = require('fs');

exports.appendToLog = function(logPath, operation, todoId, data) {
  const logObject = {
    operation,
    todoId,
    data
  };
  fs.appendFile(logPath, JSON.stringify(logObject) + '\n', err => {
    if (err) throw err;
  });
};

exports.testLogExists = async function(logFile) {
  return new Promise((resolve, reject) => {
    fs.access(logFile, fs.constants.W_OK, err => {
      if (err) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};

function splitNewlines() {
  const liner = new stream.Transform({ objectMode: true });
  liner._transform = function(chunk, encoding, done) {
    let data = chunk.toString();
    if (this._lastLine) data = this._lastLine + data;

    const lines = data.split('\n');
    this._lastLine = lines.pop();
    lines.forEach(this.push.bind(this));
    done();
  };

  liner._flush = function(done) {
    if (this._lastLine) this.push(this._lastLine);
    this._lastLine = null;
    done();
  };
  return liner;
}

function jsonParser() {
  const parser = new stream.Transform({ objectMode: true });
  parser._transform = function(chunk, encoding, done) {
    this.push(JSON.parse(chunk));
    done();
  };
  return parser;
}

exports.readLog = function(logPath) {
  const source = fs.createReadStream(logPath);
  const parser = jsonParser();
  source.pipe(splitNewlines()).pipe(parser);
  return parser;
};
