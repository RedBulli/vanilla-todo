import assert from 'assert';
import Todos from './todos';
import { it } from '../test';

it('Todos#add adds a todo to the todos', () => {
  const todos = new Todos();
  todos.add('test', 'message');
  assert.deepEqual(todos.getTodos(), {
    test: {
      message: 'message',
      completed: false
    }
  });
});

it('Todos#add throws if the todo key exits', () => {
  const todos = new Todos();
  todos.add('test', 'message');
  assert.throws(() => {
    todos.add('test', 'other');
  }, 'Todo key already exists');
});

it('Todos#edit edits todo message', () => {
  const todos = new Todos();
  todos.add('test', 'message');
  todos.edit('test', 'edited');
  assert.deepEqual(todos.getTodos(), {
    test: {
      message: 'edited',
      completed: false
    }
  });
});

it('Todos#complete marks todo as completed', () => {
  const todos = new Todos();
  todos.add('test', 'message');
  todos.complete('test');
  assert.deepEqual(todos.getTodos(), {
    test: {
      message: 'message',
      completed: true
    }
  });
});

it('Todos#uncomplete marks todo as not completed', () => {
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
});

it('Todos#remove removes todo', () => {
  const todos = new Todos();
  todos.add('test', 'message');
  todos.remove('test');
  assert.deepEqual(todos.getTodos(), {});
});
