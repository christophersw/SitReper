var express = require('express') 
  , cons = require('consolidate')
  , config = require('./config.js')
  , messaging = require('./messaging/messaging')
  , app = express();

//Set Handlebars as view engine.
app.set('views', './views');
app.engine('hbs', cons.handlebars);
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.render('index', {
    title: 'This is a title',
    message: 'This is a message'
  });
});

var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;
  
  console.log('App listening at: ', host, port);

});