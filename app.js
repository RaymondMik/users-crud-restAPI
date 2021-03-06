require('./config');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const usersRoute = require('./api/routes/users');

// App init
const app = express();

// Define Middlewares
app.use(morgan('dev')); // log HTTP requests
app.use(bodyParser.urlencoded({ extended: false })); // parse urlencoded body of POST requests
app.use(bodyParser.json()); // parse JSON body of POST requests

// Handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
        'Access-Control-Allow-Headers',
        'x-auth, Content-Type, Origin, X-Requested-With,  Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Expose-Headers', 'x-auth');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE');
        res.status(200);
    }
    next();
});

// Root route
app.get('/', function (req, res) {
  res.json({message: 'Hello World!'})
})

// Users route
app.use('/users', usersRoute);

// Handle non valid HTTP request
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error handling for not found
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports.app = app;