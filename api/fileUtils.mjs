import stream from 'stream';
import fs from 'fs';

export function appendToLog(logPath, operation) {
  fs.appendFileSync(logPath, JSON.stringify(operation) + '\n', err => {
    if (err) throw err;
  });
}

export async function testLogExists(logFile) {
  return new Promise((resolve, reject) => {
    fs.access(logFile, fs.constants.W_OK, err => {
      if (err) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
}

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

export function readLog(logPath) {
  const source = fs.createReadStream(logPath);
  const parser = jsonParser();
  source.pipe(splitNewlines()).pipe(parser);
  return parser;
}
