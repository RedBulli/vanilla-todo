import { appendToLog, readLog, testLogExists } from './fileUtils';
import Todos from '../public/todos';
import logger from '../server/logger';

export function initializeTodos(logFile) {
  return testLogExists(logFile)
    .then(() => restoreFromLog(logFile))
    .catch(() => new Todos(appendToLog.bind(null, logFile)));
}

export function restoreFromLog(logFile) {
  logger('Restoring DB from log');
  return new Promise((resolve, reject) => {
    const todos = new Todos();
    const operationStream = readLog(logFile);
    let operationsCount = 0;
    operationStream.on('readable', () => {
      let operation;
      while (null !== (operation = operationStream.read())) {
        operationsCount++;
        todos.applyOperation(operation);
      }
    });
    operationStream.on('end', () => {
      logger(`DB restored from ${operationsCount} operations`);
      todos.setOperationFn(appendToLog.bind(null, logFile));
      resolve(todos);
    });
  });
}
