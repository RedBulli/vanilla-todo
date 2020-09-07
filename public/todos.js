export default function Todos(onOperation) {
  let todos = {};
  let operationFn = onOperation;
  function opWriter(operation, todoId, data) {
    if (operationFn) {
      operationFn({ operation, todoId, data });
    }
  }

  function validateMessage(message) {
    if (typeof message !== "string" || message.length === 0) {
      throw "Validation Error";
    }
  }

  function add(todoId, message) {
    validateMessage(message);
    if (todos[todoId]) throw "Todo key already exists";
    todos[todoId] = {
      message,
      completed: false,
    };
    opWriter("add", todoId, message);
  }
  function edit(todoId, message) {
    validateMessage(message);
    todos[todoId].message = message;
    opWriter("edit", todoId, message);
  }
  function complete(todoId) {
    todos[todoId].completed = true;
    opWriter("complete", todoId);
  }
  function uncomplete(todoId) {
    todos[todoId].completed = false;
    opWriter("uncomplete", todoId);
  }
  function remove(todoId) {
    delete todos[todoId];
    opWriter("remove", todoId);
  }
  function getTodos() {
    return Object.assign({}, todos);
  }
  function setOperationFn(newFn) {
    operationFn = newFn;
  }
  function getState() {
    return Object.assign({}, todos);
  }
  function applyOperation(operation) {
    if (operation.operation === "add") {
      add(operation.todoId, operation.data);
    } else if (operation.operation === "edit") {
      edit(operation.todoId, operation.data);
    } else if (operation.operation === "complete") {
      complete(operation.todoId);
    } else if (operation.operation === "uncomplete") {
      uncomplete(operation.todoId);
    } else if (operation.operation === "remove") {
      remove(operation.todoId);
    } else {
      throw "Unknown operation";
    }
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
    setOperationFn,
    restoreSnapshot,
    getState,
  };
}
