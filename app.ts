import express from './providers/express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
const logger = require('morgan');
import session from 'express-session';

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'a4f8011f-c873-4447-8ee2'

const app = express();
app.use(
  session({
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// view engine setup
app.set('views', path.join(__dirname, "..", 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;