const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {User} = require('./../database/models/user.js');

const userIdOne = new ObjectID();
const userIdTwo = new ObjectID();
const userIdThree = new ObjectID();

// we simulate one authenticated and one non authenticated user
const users = [
    {
        _id: userIdOne,
        userName: 'TeddyBoy1',
        email: 'ciaone1@example.como',
        password: 'userOnePass',
        role: 'admin',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userIdOne, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: userIdTwo,
        userName: 'TeddyBoy2',
        email: 'ciaone2@example.com',
        password: 'userTwoPass',
        role: 'user',
        tokens: []
    },
    {
        _id: userIdThree,
        userName: 'TeddyBoy3',
        email: 'ciaone3@example.como',
        password: 'userThreePass',
        role: 'user',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userIdThree, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    },
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
