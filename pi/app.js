const express = require('express');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const reload = require('reload');

const index = require('./routes/index');
const users = require('./routes/users');
const challenge = require('./routes/challenge');
const IoT = require('./lib/iot').default;
const WSS = require('./lib/wss').default;

const { NODE_ENV } = process.env;
if (!NODE_ENV) {
  throw new Error('The NODE_ENV environment variable is required but was not specified.');
}

// Support .env.X files
const dotenvFiles = [
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && '.local',
  '.env',
].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv').config({ // eslint-disable-line global-require
      path: dotenvFile,
    });
  }
});

const app = express();
const wss = new WSS();
const iot = new IoT(wss); // eslint-disable-line no-unused-vars

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/challenge', challenge);

reload(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res /* , next */) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // Force all errors to webpage we don't care about the environment
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('unhandledRejection', (reason /* , p */) => {
  console.error(`Unhandled Rejection: ${reason.stack}`);
});

module.exports = app;
