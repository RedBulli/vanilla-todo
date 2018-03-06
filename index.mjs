import fs from 'fs';
import http from 'http';
import { handleApiRequest } from './api/requestHandler';
import { initializeTodos } from './api/todos';

const PORT = 8080; // Or process.env.SERVER_PORT
const indexFile = fs.readFileSync('public/index.html');
const favicon = fs.readFileSync('public/favicon.ico');
const script = fs.readFileSync('public/script.js');
const todosScript = fs.readFileSync('public/todos.mjs');

initializeTodos('dblog/db.log')
  .then(todos => {
    http.createServer(handleRequest.bind(null, todos)).listen(PORT);
    console.log(`Listening to port ${PORT}`);
  })
  .catch(console.error);

function handleRequest(todos, request, response) {
  console.log('URL:', request.url);
  if (request.url === '/') {
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    response.end(indexFile);
  } else if (request.url === '/favicon.ico') {
    response.writeHead(200, {
      'Content-Type': 'image/x-icon'
    });
    response.end(favicon);
  } else if (request.url === '/script.js') {
    response.writeHead(200, {
      'Content-Type': 'application/javascript'
    });
    response.end(script);
  } else if (request.url === '/todos.mjs') {
    response.writeHead(200, {
      'Content-Type': 'application/javascript'
    });
    response.end(todosScript);
  } else if (request.url.startsWith('/api/')) {
    handleApiRequest(todos, request, response);
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
}
