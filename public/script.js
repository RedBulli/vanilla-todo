function BusinessLogic() {
  let todos = undefined;
  const listeners = [];

  function generateUUID(a) {
    return a
      ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
      : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
  }

  fetch('/api/todos')
    .then(response => response.json())
    .then(responseJSON => {
      todos = responseJSON;
      stateChanged();
    });

  function sendToServer(method, todoId, data) {
    return fetch(`/api/todos/${todoId}`, {
      body: JSON.stringify(data),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json'
      },
      method: method
    }).then(response => response.json());
  }

  function add(message) {
    const todoId = generateUUID();
    todos[todoId] = {
      message,
      completed: false
    };
    sendToServer('POST', todoId, { message: message });
    stateChanged();
  }

  function edit(todoId, message) {
    todos[todoId].message = message;
    sendToServer('PATCH', todoId, { message: message });
    stateChanged();
  }

  function complete(todoId) {
    todos[todoId].completed = true;
    sendToServer('PATCH', todoId, { completed: true });
    stateChanged();
  }

  function uncomplete(todoId) {
    todos[todoId].completed = false;
    sendToServer('PATCH', todoId, { completed: false });
    stateChanged();
  }

  function remove(todoId) {
    delete todos[todoId];
    sendToServer('DELETE', todoId);
    stateChanged();
  }

  function getState() {
    return Object.assign({}, todos);
  }

  function stateChanged() {
    listeners.forEach(listener => listener());
  }

  function subscribe(callback) {
    listeners.push(callback);
  }
  return {
    add,
    edit,
    complete,
    uncomplete,
    remove,
    getState,
    subscribe
  };
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

(function() {
  const appElement = document.querySelector('#app');
  const businessLogic = BusinessLogic();
  function toggleCompletion(todoId, completed) {
    if (completed) {
      businessLogic.complete(todoId);
    } else {
      businessLogic.uncomplete(todoId);
    }
  }
  businessLogic.subscribe(() => {
    const currentChild = appElement.firstChild;
    const nextChild = todosList(businessLogic.getState(), toggleCompletion);
    if (currentChild) {
      appElement.replaceChild(nextChild, currentChild);
    } else {
      appElement.appendChild(nextChild);
    }
  });

  const formElement = document.querySelector('#newTodo');
  formElement.addEventListener('submit', ev => {
    ev.preventDefault();
    const message = ev.target.querySelector('#message').value;
    businessLogic.add(message);
  });
})();
