const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {UserSchema} = require('../schemas/user.js');

/**
 * Format JSON response 
 * instance method running on a document - this = user
 * @returns {Object} 
 */
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  const _id = userObject._id;
  const userName = userObject.userName;
  const email = userObject.email;
  const role = userObject.role;
  const isActive = userObject.isActive;

  return {_id, userName, email, role, isActive};
};

/**
 * Generate authentication token 
 * instance method running on a document - this = user
 * @returns {Promise} 
 */
UserSchema.methods.generateAuthToken = function () {
  const access = 'auth';
  const token = jwt.sign({_id: this._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  this.tokens = this.tokens.concat([{access, token}]);

  return this.save().then(() => {
    return token;
  });
};

/**
 * Delete authentication token
 * instance method running on a document - this = user
 * @param {*} token 
 */
UserSchema.methods.removeToken = function (token) {
  return this.updateOne({
    $pull: {
      tokens: {token}
    }
  });
};

/**
 * Find user by token
 * model method running on a model - this = User
 * @param {*} token 
 */
UserSchema.statics.findByToken = function (token) {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return this.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

/**
 * Find user by credentials
 * model method running on a model - this = User
 * @param {email, password} 
 */
UserSchema.statics.findByCredentials = function ({email, password}) {
  return User.findOne({email}).then((user) => {
    if (!user) Promise.reject();

    return bcrypt.compare(password, user.password).then((res) => {
      if (!res) {
        throw new Error('invalid password');
      } else {
        return user;
      }
    });
  });
}

/**
 * Save hashed and salted password
 * middleware runs before every save event on a model instance - this = User
 */
UserSchema.pre('save', function(next) {
  // run this middleware only if password in Schema was modified
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hashedPassword) => {
        this.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});

// in test environment do not initialize indexes -> https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles
const skipInit = process.env.NODE_ENV === "test";
const User = mongoose.model('user', UserSchema, skipInit);

module.exports.User = User;