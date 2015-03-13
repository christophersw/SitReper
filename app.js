var express = require('express') 
  , config = require('./config.js')
  , messaging = require('./messaging/messaging')
  , app = express();


app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at: ', host, port);

});