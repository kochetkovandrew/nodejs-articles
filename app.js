let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const fs = require('fs');

let bodyParser = require('body-parser');

let articlesRouter = require('./routes/articles');

let app = express();

const Store = require('openrecord/store/mysql');

let rawconfig = fs.readFileSync('config.json');
let config = JSON.parse(rawconfig);


store = new Store({
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  user: config.db.user,
  autoLoad: true,
  plugins: [require('openrecord/lib/base/dynamic_loading')],
  migrations: [
    require('./migrations/20190130000000_create_articles.js')
  ],
});

require('./models/article.js');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/articles', articlesRouter);


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

app.listen(config.port);
