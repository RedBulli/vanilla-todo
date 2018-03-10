import fs from 'fs';
const indexFile = fs.readFileSync('./public/index.html');
const favicon = fs.readFileSync('./public/favicon.ico');
const script = fs.readFileSync('./public/script.js');
const todosScript = fs.readFileSync('./public/todos.mjs');

export default function(request, response) {
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
  }
  return false;
}
