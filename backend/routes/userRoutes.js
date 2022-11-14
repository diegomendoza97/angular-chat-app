const User = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();


const hashPassword = async (password) => {
    try {
        const newPassword = await bcrypt.hash(password, 10);
        return newPassword;
    } catch (err) {
        console.log(err);
        return err;
    }
};

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body)
    const hashedPassword = await hashPassword(password);
    const userFound = await User.findOne({email: email, password: hashedPassword});
    if (!userFound) {
        return res.json({
            status: 404,
            message: 'User not found',
            data: null
        });
    }

    return res.json({
        status: 200,
        message: 'User found',
        data: userFound
    });
});

router.post('/create', (req, res) => {
    const {email, fullName ,password} = req.body;
    console.log(req.body);
    User.findOne({email: email}, async(err, user) => {
        if (err) {
            console.log(err);
            const hashedPassword = await hashPassword(password); 
            const newUser = await User.create({email, name: fullName, password: hashedPassword});
            res.json({
                status: 201, 
                message: 'User successfully created',
                data: newUser
            });
        } else if (!user) {
            const hashedPassword = await hashPassword(password); 
            const newUser = await User.create({email, name: fullName, password: hashedPassword});
            res.json({
                status: 201, 
                message: 'User successfully created',
                data: newUser
            });
        } else {
            console.log(err);
            console.log(user);
            res.json({
                status: 400,
                message: 'User already exists',
                data: null
            })
        }
    })
});

module.exports = router;