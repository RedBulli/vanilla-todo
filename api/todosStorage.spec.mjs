import assert from 'assert';
import fs from 'fs';
import { initializeTodos } from './todosStorage';
import { it } from '../test';

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

it('restores the todos state from a operations logfile', async () => {
  await clearLog();
  const todos = await initializeTodos(TEST_LOG_FILE);
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
  const restoredTodos = await initializeTodos(TEST_LOG_FILE);
  assert.deepEqual(todos.getTodos(), restoredTodos.getTodos());
});
