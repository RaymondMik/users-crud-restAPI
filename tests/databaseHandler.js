const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {User} = require('./../database/models/user.js');

const userIdOne = new ObjectID();
const userIdTwo = new ObjectID();

// we simulate one authenticated and one non authenticated user
const users = [
    {
        _id: userIdOne,
        email: 'ciaone1@example.com',
        password: 'userOnePass',
        type: 'admin',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userIdOne, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: userIdTwo,
        email: 'ciaone2@example.com',
        password: 'userTwoPass',
        type: 'user',
        tokens: []
    }
];

const populateUsers = async(done) => {
    await User.remove({});
    await new User(users[0]).save();
    await new User(users[1]).save();
    done();
};

const clearUsers = async(done) => {
    await User.remove({});
    done();
};

module.exports = {populateUsers, clearUsers, users};
