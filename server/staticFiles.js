import fs from "fs";
const indexFile = fs.readFileSync("./public/index.html");
const favicon = fs.readFileSync("./public/favicon.ico");
const script = fs.readFileSync("./public/script.js");
const todosScript = fs.readFileSync("./public/todos.js");

export default function (request, response) {
  if (request.url === "/") {
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });
    response.end(indexFile);
    return true;
  } else if (request.url === "/favicon.ico") {
    response.writeHead(200, {
      "Content-Type": "image/x-icon",
    });
    response.end(favicon);
    return true;
  } else if (request.url === "/script.js") {
    response.writeHead(200, {
      "Content-Type": "application/javascript",
    });
    response.end(script);
    return true;
  } else if (request.url === "/todos.js") {
    response.writeHead(200, {
      "Content-Type": "application/javascript",
    });
    response.end(todosScript);
    return true;
  }
  return false;
}
