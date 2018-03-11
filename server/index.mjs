import http from 'http';
import { handleApiRequest } from '../api/requestHandler';
import { initializeTodos } from '../api/todosStorage';
import serveStaticFile from './staticFiles';
import logger from './logger';

const PORT = process.env.PORT || 8080;

initializeTodos('./dblog/db.log')
  .then(todos => {
    http.createServer(handleRequest.bind(null, todos)).listen(PORT);
    logger(`Listening to port ${PORT}`);
  })
  .catch(console.error);

function handleRequest(todos, request, response) {
  logger('URL:', request.url);
  if (serveStaticFile(request, response)) {
    return;
  } else if (request.url.startsWith('/api/')) {
    handleApiRequest(todos, request, response);
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
}
