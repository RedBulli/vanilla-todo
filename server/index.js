import http from "http";
import { handleApiRequest } from "../api/requestHandler.js";
import { handleStreamRequest } from "../api/streamHandler.js";
import { initializeTodos } from "../api/todosStorage.js";
import serveStaticFile from "./staticFiles.js";
import logger from "./logger.js";

const PORT = process.env.PORT || 8080;

initializeTodos("./dblog/db.log")
  .then((todos) => {
    http.createServer(handleRequest.bind(null, todos)).listen(PORT);
    logger(`Listening to port ${PORT}`);
  })
  .catch(console.error);

function handleRequest(todos, request, response) {
  logger(`URL: ${request.url}`);
  if (serveStaticFile(request, response)) {
    return;
  } else if (request.url.startsWith("/api/")) {
    handleApiRequest(todos, request, response);
  } else if (request.url.startsWith("/stream")) {
    handleStreamRequest(todos, request, response);
  } else {
    response.writeHead(404).end("Not found");
  }
}
