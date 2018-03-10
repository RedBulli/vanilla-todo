import publicTodosTest from '../public/todos.spec';
import apiTodosTest from '../api/todosStorage.spec';

Promise.all([publicTodosTest(), apiTodosTest()])
  .then(() => {
    console.log('All OK');
  })
  .catch(console.error);
