const express = require('express');
const bodyParser = require('body-parser');

const url = require('./app/url/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', url);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  const response = {
    message: err.message,
    status: err.status || 500
  };

  if(err.data) {
    response.data = err.data;
  }
  
  // render the error page
  res.status(response.status);
  res.json(response);
});

module.exports = app;
