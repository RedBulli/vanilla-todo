export async function handleApiRequest(todos, request, response) {
  try {
    let requestData = null;
    if (request.method === "POST" || request.method === "PATCH") {
      requestData = await processPost(request, response);
    }
    const res = await route(todos, request, response, requestData);
    if (res) {
      respondJSON(response, res.status, res.body);
    } else {
      respondJSON(response, 404, { message: "Not found" });
    }
  } catch (e) {
    console.error(e);
    respondJSON(response, 500, { error: "Something went wrong" });
  }
}

const uuidMatcher =
  "[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

function route(todos, request, response, data) {
  if (request.method === "GET") {
    return { status: 200, body: todos.getTodos() };
  }
  const todoId = getTodoId(request.url);
  if (!todoId) {
    return respondNotFound(response);
  }
  if (request.method === "POST") {
    const isApplied = todos.applyOperation(data);
    if (isApplied) {
      return { status: 200, body: { message: "Operation applied" } };
    } else {
      return {
        status: 400,
        body: { message: "Operation has already been applied" },
      };
    }
  }
}

function respondJSON(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  });
  response.end(JSON.stringify(body));
}

async function processPost(request) {
  let resolve = () => {};
  let reject = () => {};
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  let postData = "";

  request.on("data", (data) => {
    postData += data;
    if (postData.length > 1e6) reject("No way");
  });

  request.on("end", () => {
    try {
      resolve(JSON.parse(postData));
    } catch (error) {
      reject(error);
    }
  });
  return promise;
}

function getTodoId(path) {
  const match = path.match(uuidMatcher);
  if (match) {
    return match[0].substr(0, match[0].length);
  }
}

function respondNotFound(response) {
  return respondJSON(response, 404, { message: "Not found" });
}
