 const {User} = require('../database/models/user');

/**
 * Authenticate user by token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 const authenticate = (req, res, next) => {
  token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if (!user) return Promise.reject();
    req.user = user;
    req.token = token;
    req.isAdmin = user.role === 'admin' ? true : false; 
    
    next();
  }).catch((e) => {
    res.status(401).send('You are not authenticated');
  });
};

module.exports = { authenticate };