import publicTodosTest from './public/todos.spec';
import apiTodosTest from './api/todos.spec';

Promise.all([publicTodosTest(), apiTodosTest()])
  .then(() => {
    console.log('All OK');
  })
  .catch(console.error);
