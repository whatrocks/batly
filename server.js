var app = require('./server-config.js');

var port = process.env.PORT || 8888;
var host = process.env.HOST || '127.0.0.1';

app.listen(port, host);

console.log('Server now listening on port ' + port);
