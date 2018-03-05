const { initializeTodos } = require('./todos');
let todos = null;
initializeTodos('dblog/db.log')
  .then(res => {
    todos = res;
  })
  .catch(console.error);
const uuidMatcher =
  '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';

function respondJSON(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
  response.end(JSON.stringify(body));
}

function getTodoId(path) {
  const match = path.match(uuidMatcher);
  if (match) {
    return match[0].substr(0, match[0].length);
  }
}

function respondNotFound(response) {
  return respondJSON(response, 404, { message: 'Not found' });
}

async function processPost(request) {
  let resolve = () => {};
  let reject = () => {};
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  let postData = '';

  request.on('data', data => {
    postData += data;
    if (postData.length > 1e6) reject('No way');
  });

  request.on('end', () => {
    resolve(JSON.parse(postData));
  });
  return promise;
}

function route(request, response, data) {
  console.log(request.method);
  if (request.method === 'GET') {
    return { status: 200, body: todos.getTodos() };
  }
  const todoId = getTodoId(request.url);
  if (!todoId) {
    return respondNotFound(response);
  }
  if (request.method === 'POST') {
    todos.add(todoId, data.message);
    return { status: 201, body: { message: 'Todo created' } };
  } else if (request.method === 'PATCH') {
    if (data.message) {
      todos.edit(todoId, data.message);
      return { status: 200, body: { message: 'Todo message edited' } };
    } else if (typeof data.completed === 'boolean') {
      if (data.completed) {
        todos.complete(todoId);
      } else {
        todos.uncomplete(todoId);
      }
      return { status: 200, body: { message: 'Todo completion changed' } };
    }
    throw 'Unknown operation';
  } else if (request.method === 'DELETE') {
    todos.remove(todoId);
    return { status: 200, body: { message: 'Deleted' } };
  }
}

exports.handleApiRequest = async function(request, response) {
  try {
    let requestData = null;
    if (request.method === 'POST' || request.method === 'PATCH') {
      requestData = await processPost(request, response);
    }
    const res = await route(request, response, requestData);
    if (res) {
      respondJSON(response, res.status, res.body);
    } else {
      respondJSON(response, 404, { message: 'Not found' });
    }
  } catch (e) {
    console.error(e);
    respondJSON(response, 500, { error: 'Something went wrong' });
  }
};
