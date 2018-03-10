import assert from 'assert';
import Todos from './todos';

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

function testTodoAddCollisionThrows() {
  const todos = new Todos();
  todos.add('test', 'message');
  assert.throws(() => {
    todos.add('test', 'other');
  }, 'Todo key already exists');
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
export default function test() {
  return Promise.all([
    testTodoAdd(),
    testTodoEdit(),
    testTodoComplete(),
    testTodoUncomplete(),
    testTodoRemove(),
    testTodoAddCollisionThrows()
  ]);
}
