const fs = require('fs');
function appendToLog(logPath, operation, todoId, data) {
  const logObject = {
    operation,
    todoId,
    data
  };
  fs.appendFile(logPath, JSON.stringify(logObject) + '\n', err => {
    if (err) throw err;
  });
}

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

function testLogAccess(logFile) {
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

exports.initializeTodos = async function(logFile) {
  try {
    await testLogAccess(logFile);
    return restoreFromLog(logFile);
  } catch (error) {
    return new Todos(logFile);
  }
};

function restoreFromLog(logFile) {
  return new Promise((resolve, reject) => {
    const todos = new Todos();
    var lineReader = require('readline').createInterface({
      input: fs.createReadStream(logFile)
    });

    lineReader.on('line', function(line) {
      const operation = JSON.parse(line);
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
    });
    lineReader.on('close', function(line) {
      todos.setLogFile(logFile);
      resolve(todos);
    });
  });
}

exports.restoreFromLog = restoreFromLog;
exports.Todos = Todos;
