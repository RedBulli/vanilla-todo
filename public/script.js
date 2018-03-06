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
  const todosEl = document.createElement('ul');
  const mockTodo = document.createElement('li');
  Object.keys(todos).forEach(todoId => {
    const todo = todos[todoId];
    const todoEl = document.createElement('li');
    const textSpan = document.createElement('span');
    textSpan.textContent = todo.message;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.onchange = function() {
      toggleCompletion(todoId, !todo.completed);
    };
    todoEl.appendChild(textSpan);
    todoEl.appendChild(checkbox);
    todosEl.appendChild(todoEl);
  });
  return todosEl;
}

function updateUI(todos) {
  const appElement = document.querySelector('#app');
  const currentChild = appElement.firstChild;
  const nextChild = todosList(todos.getState(), toggleCompletion);
  if (currentChild) {
    appElement.replaceChild(nextChild, currentChild);
  } else {
    appElement.appendChild(nextChild);
  }

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
      const message = ev.target.querySelector('#message').value;
      todos.add(generateUUID(), message);
    });
  });
})();
