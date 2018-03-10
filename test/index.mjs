import '../public/todos.spec';
import '../api/todosStorage.spec';

export async function it(message, testFn) {
  await testFn();
  console.log(message, 'OK');
}
