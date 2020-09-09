export function handleStreamRequest(todos, request, response) {
  response.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  todos.subscribe((event) => {
    response.write(`data: ${JSON.stringify(event)}\n\n`);
  });
}
