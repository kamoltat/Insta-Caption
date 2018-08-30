const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passport = require('passport');
const cors = require('cors');
const app = express();

// app.use(function(req, res, next){
//     // Specify the Domain you wish to allow or give * to allow all 	origins.
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/auth/google/');
//
//     // Request methods you wish to allow or * to allow all.
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//
//     // Check if preflight request
//     if (req.method === 'OPTIONS') {
//         res.status(200);
//         res.end();
//     }
//     else {
//         // Pass to next layer of middleware
//         next();
//     }
// });
app.use(cors());



app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


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
