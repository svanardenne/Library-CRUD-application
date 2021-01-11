var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./models').sequelize; // import Sequelize
sequelize.authenticate();
sequelize.sync();

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error(`Sorry! We couldn't find the page you were looking for.`);
  err.status = 404;
  next(err)
});

// error handler
app.use((err, req, res, next) => {
  if(err.status) {
    if(err.status === 404) {
      res.render('page-not-found', {err});
    } else {
      res.render('error', {err});
    }
  } else {
    err.message = "Sorry! There was an unexpected error on the server."
    err.status = 500;
    console.log(err.status, err.message);
    res.render('error', {err});
  }

});

module.exports = app;
