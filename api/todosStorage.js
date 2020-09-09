import { appendToLog, readLog, testLogExists } from "./fileUtils.js";
import Todos from "../public/todos.js";
import logger from "../server/logger.js";

export function initializeTodos(logFile) {
  return testLogExists(logFile)
    .then(() => restoreFromLog(logFile))
    .catch(() => new Todos())
    .then((todos) => {
      todos.subscribe(appendToLog.bind(null, logFile));
      return todos;
    });
}

export function restoreFromLog(logFile) {
  logger("Restoring DB from log");
  return new Promise((resolve, reject) => {
    const todos = new Todos();
    const operationStream = readLog(logFile);
    let operationsCount = 0;
    operationStream.on("readable", () => {
      let operation;
      while (null !== (operation = operationStream.read())) {
        operationsCount++;
        todos.applyOperation(operation);
      }
    });
    operationStream.on("end", () => {
      logger(`DB restored from ${operationsCount} operations`);
      resolve(todos);
    });
  });
}
