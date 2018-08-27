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
    if (!req.isAdmin) return res.status(401).send('You are not authorized to perform this operation.');
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(404);
    }
});

// GET single user
router.get('/:id', authenticate, (req, res) => {
    res.send(req.user);
});

// POST sign up (create new user)
router.post('/add', async(req, res) => {
    const body = {
        userName: req.body.userName, 
        email: req.body.email, 
        password: req.body.password,
        role: req.body.role
    };

    Object.entries(body).forEach((value) => {
        if (typeof value[1] !== 'string') return res.status(400).send(`${value[0]} should be a string`);
    });

    const newUser = new User({
        userName: body.userName,
        email: body.email,
        password: body.password,
        role: body.role
    });

    try {
        await newUser.save();
        const token = newUser.generateAuthToken();
        res.header('x-auth', token).send(newUser);
    } catch(e) {
        res.status(400).send(e.message);
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
        res.status(401).send(e.message);
    }
});

// POST sign out (log out user)
router.post('/logout/:id', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send('Logged out');
    } catch(e) {
        res.status(401).send(e.message);;
    }
});

// PATCH update user
router.patch('/update/:id', authenticate, async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send(`The ID: ${req.params.id} is not valid`);

     // Admins can update everyone's data, users only their own data
     if (!req.isAdmin && req.params.id !== req.user._id) return res.status(401).send('You are not authorized to perform this operation.');

    const body = {
        userName: req.body.userName, 
        // email: req.body.email, 
        // password: req.body.password
    };

    Object.entries(body).forEach((value) => {
        if (typeof value[1] !== 'string') return res.status(400).send(`${value[0]} passed should be a string`);
    });

    try {
        const updatedUser = await User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: body},
            {new: true, runValidators: true}
        );

        if (!updatedUser) return res.status(404).send('User not found');
    
        return res.send({updatedUser});
    } catch(e) {
        res.status(500).send(e.message);
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