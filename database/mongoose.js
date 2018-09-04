const mongoose = require('mongoose');

// mongoose setup
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') mongoose.connect(process.env.MONGODB_URI);

module.exports.mongoose = mongoose;