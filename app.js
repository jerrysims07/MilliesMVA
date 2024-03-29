require('./models/game');


// express application
var game = require('./routes/game');


// modules
var express = require('express');
var http = require('http');
var path = require('path');
var less = require('express-less');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/millieMVA');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/less', less(__dirname + '/less', { compress: true }));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// route definitions
app.get('/', game.index);
app.post('/new', game.create);
app.put('/move', game.move);

// start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
