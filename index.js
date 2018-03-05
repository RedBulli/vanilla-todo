const fs = require('fs');
const http = require('http');
const { handleApiRequest } = require('./api/requestHandler');
const { initializeTodos } = require('./api/todos');

const PORT = 8080; // Or process.env.SERVER_PORT
const indexFile = fs.readFileSync('public/index.html');
const favicon = fs.readFileSync('public/favicon.ico');
const script = fs.readFileSync('public/script.js');

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
  } else if (request.url.startsWith('/api/')) {
    handleApiRequest(todos, request, response);
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
}
