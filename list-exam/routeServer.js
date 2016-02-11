var http = require('http');

http.createServer(function(req,res) {
 if (req.url === '/' && req.method === 'GET') {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello <strong>Home page</strong>');
 } else if (req.url === '/account' && req.method === 'GET') {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello <strong>Account page</strong>');
 } else {
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end('404 error not found');
 }
}).listen(1337);
