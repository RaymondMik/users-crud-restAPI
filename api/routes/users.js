const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');
const {mongoose} = require('../../database/mongoose.js');
const {User} = require('../../database/models/user.js');
const {authenticate} = require('../../middlewares/authenticate.js');

// TODO if new routes will be added, consider to add accesscontrol npm package to implement Role-Based Access Control. 

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
router.get('/:id', authenticate, async(req, res) => {
    // Admins can update everyone's data, users only their own data
    if (!req.isAdmin && req.params.id != req.user._id) return res.status(401).send('You are not authorized to perform this operation.');

    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch (e) {
        res.status(404);
    }
});

// POST sign up (create new user)
router.post('/sign-up', async(req, res) => {
    const newUser = new User({
        userName: req.body.userName, 
        email: req.body.email, 
        password: req.body.password,
        role: req.body.role
    });
    
    try {
        await newUser.save();
        // email confirmation should be implemented
        res.status(200).send({message: 'User created successfully'});
    } catch(e) {
        res.status(400).send(e.message);
    }
});

// POST sign in (log in existing user)
router.post('/sign-in', async(req, res) => {
    const loginRequest = {
        email: req.body.email,
        password: req.body.password
    }
    
    try {
        const user = await User.findByCredentials(loginRequest);
        const token = await user.generateAuthToken();
        return res.set('x-auth', token).send(user);
    } catch(e) {
        return res.status(401).send(e.message);
    }
});

// POST sign user out
router.post('/sign-out/:id', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send({message: 'Signed out successfully'});
    } catch(e) {
        res.status(401).send(e.message);
    }
});

// PATCH update user
router.patch('/update/:id', authenticate, async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send(`The ID: ${req.params.id} is not valid`);

    // TODO
    // ADD POSSIBILITY TO MODIFY PASSWORD WITH EMAIL CONFIRMATION SYSTEM
    // Admins can update everyone's data, users only their own data
    if (!req.isAdmin && req.params.id != req.user._id) return res.status(401).send('You are not authorized to perform this operation.');
    
    const body = {};

    if (req.body.userName && typeof req.body.userName === 'string') body.userName = req.body.userName;
    if (req.body.email && typeof req.body.email === 'string') body.email = req.body.email;
    if (req.isAdmin) {
        if (req.body.role && typeof req.body.role === 'string') body.role = req.body.role;
    }
    
    Object.values(body).forEach((value) => {
        if (typeof value !== 'string') return res.status(400).send(`${value[0]} passed should be a string`);
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
        return res.status(500).send(e.message);;
    }
});

// PATCH update user status
router.patch('/status/:id', authenticate, async (req, res) => {
    // Admins can delete everyone's account, users only their own
    if (!req.isAdmin) return res.status(401).send('You are not authorized to perform this operation.');
    if (typeof req.body.isActive !== 'boolean') return res.status(400).send(`Value passed should be a boolean`)

    try {
        const updatedUser = await User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: {isActive: req.body.isActive}},
            {new: true, runValidators: true}
        );

        if (!updatedUser) return res.status(404).send('User not found');
    
        return res.send({updatedUser});
    } catch(e) {
        return res.status(500).send(e.message);;
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