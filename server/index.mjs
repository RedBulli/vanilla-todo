import http from 'http';
import { handleApiRequest } from '../api/requestHandler';
import { initializeTodos } from '../api/todosStorage';
import serveStaticFile from './staticFiles';

const PORT = 8080; // Or process.env.SERVER_PORT

initializeTodos('./dblog/db.log')
  .then(todos => {
    http.createServer(handleRequest.bind(null, todos)).listen(PORT);
    console.log(`Listening to port ${PORT}`);
  })
  .catch(console.error);

function handleRequest(todos, request, response) {
  console.log('URL:', request.url);
  if (serveStaticFile(request, response)) {
    return;
  } else if (request.url.startsWith('/api/')) {
    handleApiRequest(todos, request, response);
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
}
