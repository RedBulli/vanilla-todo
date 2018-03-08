import Todos from './todos.mjs';

function generateUUID(a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
}

function getTodos() {
  return fetch('/api/todos').then(response => response.json());
}

function sendToServer(operation) {
  return fetch(`/api/todos/${operation.todoId}`, {
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(operation)
  }).then(response => response.json());
}

function todosList(todos, toggleCompletion) {
  const todoTemplate = document.querySelector('#todo');
  return Object.keys(todos).map(todoId => {
    const todoEl = todoTemplate.content.cloneNode(true);
    const todo = todos[todoId];
    todoEl.querySelector('.message').textContent = todo.message;
    const checkboxEl = todoEl.querySelector('.completed');
    checkboxEl.checked = todo.completed;
    checkboxEl.onchange = toggleCompletion.bind(null, todoId, !todo.completed);
    return todoEl;
  });
}

function updateUI(todos) {
  const todosElement = document.querySelector('#todos');
  todosElement.innerHTML = '';
  todosList(todos.getState(), toggleCompletion).forEach(todoEl => {
    todosElement.appendChild(todoEl);
  });

  function toggleCompletion(todoId, completed) {
    if (completed) {
      todos.complete(todoId);
    } else {
      todos.uncomplete(todoId);
    }
  }
}

(function() {
  getTodos().then(response => {
    const todos = Todos(stateChanged);
    todos.restoreSnapshot(response);
    updateUI(todos);

    function stateChanged(operation) {
      sendToServer(operation);
      updateUI(todos);
    }

    const formElement = document.querySelector('#newTodo');
    formElement.addEventListener('submit', ev => {
      ev.preventDefault();
      const messageEl = ev.target.querySelector('#message');
      const message = messageEl.value;
      todos.add(generateUUID(), message);
      messageEl.value = '';
    });
  });
})();
