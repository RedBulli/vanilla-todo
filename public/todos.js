function generateUUID(a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
}

export default function Todos() {
  let todos = {};
  let callbacks = [];
  let operations = {};

  function opWriter(operation) {
    callbacks.forEach((callback) => {
      callback(operation);
    });
  }

  function subscribe(callback) {
    callbacks.push(callback);
    const unsubscribe = () => {
      callbacks.splice(callbacks.indexOf(callback), 1);
    };
    return unsubscribe;
  }

  function validateMessage(message) {
    if (typeof message !== "string" || message.length === 0) {
      throw "Validation Error";
    }
  }

  function add(todoId, message) {
    applyOperation({ operation: "add", todoId, data: message });
  }

  function edit(todoId, message) {
    applyOperation({ operation: "edit", todoId, data: message });
  }

  function complete(todoId) {
    applyOperation({ operation: "complete", todoId });
  }

  function uncomplete(todoId) {
    applyOperation({ operation: "uncomplete", todoId });
  }

  function remove(todoId) {
    applyOperation({ operation: "remove", todoId });
  }

  function getTodos() {
    return Object.assign({}, todos);
  }

  function getState() {
    return Object.assign({}, todos);
  }

  function validateTodoExists(todoId) {
    if (!todos[todoId]) {
      throw `Todo ${todoId} doesn't exist`;
    }
  }

  function applyOperation(operation) {
    if (!operation.id) {
      operation.id = generateUUID();
    } else if (operations[operation.id]) {
      // Don't reapply operations
      return;
    }
    if (operation.operation === "add") {
      validateMessage(operation.data);
      if (todos[operation.todoId]) throw "Todo key already exists";
      todos[operation.todoId] = {
        message: operation.data,
        completed: false,
      };
    } else if (operation.operation === "edit") {
      validateTodoExists(operation.todoId);
      validateMessage(operation.data);
      todos[operation.todoId].message = operation.data;
    } else if (operation.operation === "complete") {
      validateTodoExists(operation.todoId);
      todos[operation.todoId].completed = true;
    } else if (operation.operation === "uncomplete") {
      validateTodoExists(operation.todoId);
      todos[operation.todoId].completed = false;
    } else if (operation.operation === "remove") {
      validateTodoExists(operation.todoId);
      delete todos[operation.todoId];
    } else {
      throw "Unknown operation";
    }
    operations[operation.id] = operation;
    opWriter(operation);
  }

  function restoreSnapshot(snapshot) {
    todos = snapshot;
  }
  return {
    add,
    edit,
    complete,
    uncomplete,
    remove,
    getTodos,
    applyOperation,
    restoreSnapshot,
    getState,
    subscribe,
    operations,
  };
}
