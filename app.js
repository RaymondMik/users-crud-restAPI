require('./config');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const baseRoutes = require('./api/routes/base');
const userRoutes = require('./api/routes/user');

// App init
const app = express();

// Define Middlewares
app.use(morgan('dev')); // log HTTP requests
app.use(bodyParser.urlencoded({ extended: false })); // parse urlencoded body of POST requests
app.use(bodyParser.json()); // parse JSON body of POST requests

// Handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Base route
app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Users route
app.use('/users', userRoutes);

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