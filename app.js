var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./models').sequelize; // import Sequelize
sequelize.authenticate();
sequelize.sync();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error(`Sorry, we can't find what you are looking for.`);
  err.status = 404;
  next(err)
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if(!err.message && !err.status) {
    err.message = "Oops, something went wrong."
    err.status = 500;
  }
  // render the error page
  res.render('error', {err});
});

module.exports = app;
