const { appendToLog, readLog, testLogExists } = require('./db');

function Todos(logPath) {
  const todos = {};
  let logFile = logPath;
  function opWriter(operation, todoId, data) {
    if (logFile) {
      appendToLog(logFile, operation, todoId, data);
    }
  }

  function validateMessage(message) {
    if (typeof message !== 'string' || message.length === 0) {
      throw 'Validation Error';
    }
  }

  function add(todoId, message) {
    validateMessage(message);
    todos[todoId] = {
      message,
      completed: false
    };
    opWriter('add', todoId, message);
  }
  function edit(todoId, message) {
    validateMessage(message);
    todos[todoId].message = message;
    opWriter('edit', todoId, message);
  }
  function complete(todoId) {
    todos[todoId].completed = true;
    opWriter('complete', todoId);
  }
  function uncomplete(todoId) {
    todos[todoId].completed = false;
    opWriter('uncomplete', todoId);
  }
  function remove(todoId) {
    delete todos[todoId];
    opWriter('remove', todoId);
  }
  function getTodos() {
    return Object.assign({}, todos);
  }
  function setLogFile(path) {
    logFile = path;
  }
  return {
    add,
    edit,
    complete,
    uncomplete,
    remove,
    getTodos,
    setLogFile
  };
}

exports.initializeTodos = function(logFile) {
  return testLogExists(logFile)
    .then(() => restoreFromLog(logFile))
    .catch(() => new Todos(logFile));
};

function applyOperation(todos, operation) {
  if (operation.operation === 'add') {
    todos.add(operation.todoId, operation.data);
  } else if (operation.operation === 'edit') {
    todos.edit(operation.todoId, operation.data);
  } else if (operation.operation === 'complete') {
    todos.complete(operation.todoId);
  } else if (operation.operation === 'uncomplete') {
    todos.uncomplete(operation.todoId);
  } else if (operation.operation === 'remove') {
    todos.remove(operation.todoId);
  } else {
    throw 'Unknown operation';
  }
}

function restoreFromLog(logFile) {
  console.log('Restoring DB from log');
  return new Promise((resolve, reject) => {
    const todos = new Todos();
    const operationStream = readLog(logFile);
    operationStream.on('readable', () => {
      let chunk;
      while (null !== (chunk = operationStream.read())) {
        process.stdout.write('.');
        applyOperation(todos, chunk);
      }
    });
    operationStream.on('end', () => {
      process.stdout.write('\n');
      console.log('DB restored');
      todos.setLogFile(logFile);
      resolve(todos);
    });
  });
}

exports.restoreFromLog = restoreFromLog;
exports.Todos = Todos;
