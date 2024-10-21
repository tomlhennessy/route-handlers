const http = require('http');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value ? value.replace(/\+/g, " ") : ""])  // Check if value is defined
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

    // define route handlers here
    if (req.method === 'GET' && req.url === '/') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dog Club');
    }

    if (req.method === 'GET' && req.url.startsWith('/dogs')) {
      const urlParts = req.url.split('/'); // split url into parts
      if (urlParts.length === 3 && !isNaN(urlParts[2])) { // check if dogID exists and is a number
        const dogId = urlParts[2]; // extract dogID
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end(`Dog details for dogId: ${dogId}`);
      }
    }

    if (req.method === 'GET' && req.url === '/dogs/new') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dog create form page');
    }

    if (req.method === 'POST' && req.url === '/dogs') {
      const newDogId = getNewDogId(); // generate new dog ID
      res.statusCode = 302; // status code for redirect
      res.setHeader('Location', `/dogs/${newDogId}`); // redirect to new dog page
      return res.end();
    }

    if (req.method === 'POST' && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/');
      if (urlParts.length === 3 && !isNaN(urlParts[2])) { // check if dogId exists and is a number
        const dogId = urlParts[2];
        res.statusCode = 302; // status code for redirect
        res.setHeader('Location', `/dogs/${dogId}`); // redirect to the same dog page
        return res.end();
      }
    }

    if (req.method === 'GET' && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/');
      if (urlParts.length === 4 && urlParts[3] === 'edit' && !isNaN(urlParts[2])) {
        const dogId = urlParts[2];
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end(`Dog edit form page for dogId: ${dogId}`);
      }
    }

    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 4000;

server.listen(port, () => console.log('Server is listening on port', port));
