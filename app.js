var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var studentsRouter = require('./routes/admin');
var adminRouter = require('./routes/admin');
var facultyRouter = require('./routes/faculty');
const passport = require('passport');
const database = require('./database');

var app = express();



const programs = require('./models/programs');
const students = require('./models/students');
const subjects = require('./models/subjects');
const faculty = require('./models/faculty');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// //////////////////////////////////////////////////////////////////////////////////////////// Serelized and deserialized
passport.serializeUser(function (entity, done) {
  done(null, { id: entity.id, role: entity.role });
});

passport.deserializeUser(function (obj, done) {
  switch (obj.role) {
      case 'faculty':
          faculty.findById(obj.id)
              .then(user => {
                  if (user) {
                      done(null, user);
                  }
                  else {
                      done(new Error('user id not found:' + obj.id, null));
                  }
              });
          break;
      case 'student':
          students.findById(obj.id)
              .then(device => {
                  if (device) {
                      done(null, device);
                  } else {
                      done(new Error('device id not found:' + obj.id, null));
                  }
              });
          break;
      default:
          done(new Error('no entity type:', obj.type), null);
          break;
  }
});
//login routes


app.use('/', indexRouter);
app.use('/students', studentsRouter);
app.use('/faculty', facultyRouter);
app.use('/admin', adminRouter);


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
