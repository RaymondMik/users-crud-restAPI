const mongoose = require('mongoose');

// mongoose setup
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports.mongoose = mongoose;