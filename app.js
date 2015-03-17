var express = require('express') 
  , exphbs  = require('express-handlebars')
  , bodyParser = require('body-parser')
  , config = require('./config.js')
  , homeController = require('./controllers/homeController')
  , sitRepController = require('./controllers/sitRepController')
  , messaging = require('./messaging/messaging')
  , sitReps = require('./models/sitRep')
  , accounts = require('./models/account')
  , app = express()
  , passwords = require('./models/passwords');

//Set Handlebars as view engine.
var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir:'./views/partials'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Set routing for static files
app.use('/public', express.static('./public'));

/*
  Routes for HOME
*/
// GET: /
app.get('/',  function(req, res){
  homeController.getIndex(req, res);
});

// POST: /
app.post('/', function(req, res){homeController.postIndex(req, res);});


/*
  Routes for SitRep
*/
app.get('/sitrep/:id/setup', function(req, res){
  sitRepController.getSetup(req, res);
});

app.get('/sitrep/:id', function(req, res){
  sitRepController.getSitRep(req, res);
});

app.post('/sitrep/:id/setup', function(req, res){sitRepController.postSetup(req, res)});

/*
  Start Server
*/
var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;
  
  console.log('App listening at: ', host, port);

});