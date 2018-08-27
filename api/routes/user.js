const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');
const {mongoose} = require('../../database/mongoose.js');
const {User} = require('../../database/models/user.js');
const {authenticate} = require('../../middlewares/authenticate');

// TODO if new routes will be added, consider to add accesscontrol to implement Role-Based Access Control. 

// GET all users
router.get('/', authenticate, async(req, res) => {
    // Make this route accessible to Admins only
    if (!req.isAdmin) return res.status(401).send('This operation is restricted to Admins!');
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.sendStatus(404);
    }
});

// GET single user
router.get('/:id', authenticate, (req, res) => {
    res.send(req.user);
});

// POST sign up (create new user)
router.post('/add', async(req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });

    try {
        await newUser.save();
        const token = newUser.generateAuthToken();
        res.header('x-auth', token).send(newUser);
    } catch(e) {
        res.sendStatus(400);
    }
});

// POST sign in (log in existing user)
router.post('/login', async(req, res) => {
    const loginRequest = {
        email: req.body.email,
        password: req.body.password
    }
    
    try {
        const user = await User.findByCredentials(loginRequest);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.sendStatus(401)
    }
});

// POST sign out (log out user)
router.post('/logout/:id', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send('Logged out');
    } catch(e) {
        res.status(401);
    }
});

// DELETE user
router.delete('/delete/:id', authenticate, async (req, res) => {
    // Make this route accessible to Admins only
    if (!req.isAdmin) return res.status(401).send('This operation is restricted to Admins!');

    User.findByIdAndRemove(req.params.id, (err, user) => {
        // Handle errors
        if (err) return res.status(500).send(err);
       
        // Send response back
        const response = {
            message: "User successfully deleted",
            id: user._id
        };
        return res.status(200).send(response);
    });

});

module.exports = router;