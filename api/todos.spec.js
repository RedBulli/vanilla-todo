const assert = require('assert');
const fs = require('fs');
const { Todos, restoreFromLog } = require('./todos');

const TEST_LOG_FILE = 'dblog/test.log';

function clearLog() {
  return new Promise((resolve, reject) => {
    fs.truncate(TEST_LOG_FILE, 0, err => {
      if (err) {
        console.error(err);
      }
      resolve();
    });
  });
}

function testTodoAdd() {
  const todos = new Todos();
  todos.add('test', 'message');
  assert.deepEqual(todos.getTodos(), {
    test: {
      message: 'message',
      completed: false
    }
  });
}

function testTodoEdit() {
  const todos = new Todos();
  todos.add('test', 'message');
  todos.edit('test', 'edited');
  assert.deepEqual(todos.getTodos(), {
    test: {
      message: 'edited',
      completed: false
    }
  });
}

function testTodoComplete() {
  const todos = new Todos();
  todos.add('test', 'message');
  todos.complete('test');
  assert.deepEqual(todos.getTodos(), {
    test: {
      message: 'message',
      completed: true
    }
  });
}

function testTodoUncomplete() {
  const todos = new Todos();
  todos.add('test', 'message');
  todos.complete('test');
  todos.uncomplete('test');
  assert.deepEqual(todos.getTodos(), {
    test: {
      message: 'message',
      completed: false
    }
  });
}

function testTodoRemove() {
  const todos = new Todos();
  todos.add('test', 'message');
  todos.remove('test');
  assert.deepEqual(todos.getTodos(), {});
}

async function testRestore() {
  await clearLog();
  const todos = new Todos(TEST_LOG_FILE);
  todos.add('test', 'message');
  todos.add('test2', 'message2');
  todos.add('test3', 'message3');
  todos.add('test4', 'message4');
  todos.edit('test', 'newMessage');
  todos.complete('test2');
  todos.complete('test3');
  todos.uncomplete('test2');
  todos.remove('test3');
  todos.complete('test');
  const restoredTodos = await restoreFromLog(TEST_LOG_FILE);
  assert.deepEqual(todos.getTodos(), restoredTodos.getTodos());
}
Promise.all([
  testTodoAdd(),
  testTodoEdit(),
  testTodoComplete(),
  testTodoUncomplete(),
  testTodoRemove(),
  testRestore()
])
  .then(() => {
    console.log('All OK');
  })
  .catch(console.error);
