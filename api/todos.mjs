import { appendToLog, readLog, testLogExists } from './db';
import Todos from '../public/todos';

export function initializeTodos(logFile) {
  return testLogExists(logFile)
    .then(() => restoreFromLog(logFile))
    .catch(() => new Todos(appendToLog.bind(null, logFile)));
}

export function restoreFromLog(logFile) {
  console.log('Restoring DB from log');
  return new Promise((resolve, reject) => {
    const todos = new Todos();
    const operationStream = readLog(logFile);
    operationStream.on('readable', () => {
      let operation;
      while (null !== (operation = operationStream.read())) {
        process.stdout.write('.');
        todos.applyOperation(operation);
      }
    });
    operationStream.on('end', () => {
      process.stdout.write('\n');
      console.log('DB restored');
      todos.setOperationFn(appendToLog.bind(null, logFile));
      resolve(todos);
    });
  });
}
