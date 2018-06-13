var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy =  require('passport-local').Strategy;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalog = require('./routes/catalog');  //Import routes for "catalog" area of site



//Set up mongoose connection
var mongoose = require('mongoose');

// var mongoDB = 'mongodb://phamphanminhtoan:ppmt7897@ds117590.mlab.com:17590/onlinelibrary';
//var mongoDB = 'mongodb://127.0.0.1:27017/admin';
var mongoDB = 'mongodb://phamphanminhtoan:ppmt7897@ds117590.mlab.com:17590/onlinelibrary';

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname:'.hbs'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname:'.hbs',layoutsDir:__dirname + '/views/layouts'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalog);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
