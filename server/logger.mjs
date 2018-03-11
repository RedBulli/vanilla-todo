const LOG_LEVELS = ['ERRORS', 'INFO', 'DEBUG'];

function logLevel() {
  return process.env.LOG_LEVEL || 'INFO';
}

function shouldLog(level) {
  const loggedLevels = LOG_LEVELS.slice(0, LOG_LEVELS.indexOf(logLevel()) + 1);
  return loggedLevels.includes(level);
}

export default function log(message, level = 'INFO') {
  if (shouldLog(level)) {
    console.log(message);
  }
}
