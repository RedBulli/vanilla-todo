import assert from 'assert';
import '../public/todos.spec';
import '../api/todosStorage.spec';
process.env.LOG_LEVEL = 'ERRORS';

export async function it(message, testFn) {
  try {
    await testFn();
    console.log('\x1b[32m%s\x1b[0m', message + ': OK');
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', message + ': FAIL');
    if (error instanceof assert.AssertionError) {
    } else {
      throw error;
    }
  }
}

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled promise rejection:', reason);
  process.exitCode = 1;
});
