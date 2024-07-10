const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('../models/userSchema')

//=========SETUP MIDDLEWARE==========
router.use(cors());
router.use(express.json())

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token,
        'secretKey',
        (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
};

//==========ROUTES===========
/*
|================================================|
| CRUD OPERATION | HTTP VERB | EXPRESS METHOD    |
|================|===========|===================|
|CREATE          | POST      |  router.post()    |
|----------------|-----------|-------------------|
|READ            | GET       |  router.get()     |  
|----------------|-----------|-------------------|     
|UPDATE          | PUT       |  router.put()     |
|----------------|-----------|-------------------|
|DELETE          | DELETE    |  router.delete()  |
|================|===========|===================|
*/

//=============GET=====================
//Route to handle a GET request to fetch a single user
router.get('/userId', authenticateToken, async (req, res) => {
    console.log('Finding user');
    try {
        const user = await User.findById(req.user.userId)

        if (!user) {
            console.error('User not found');
            return res.status(400).json({message: 'User Not Found'})
            
        }
    } catch (error) {
        console.error('Error fetching Users', error.message);
        res.status(500).json(
            {message: 'Internal Server Error', error: error.message})
    }
})

//Route to handle a GET request to fetch all users
router.get('/findUsers', async (req, res) => {
    console.log('Finding users');
    try {
        const {username} = req.query;
        const query = username ? {username} : {};
        const users = await User.find(query)

        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users');
        res.status(500).json({message: 'Internal Server Error'})
    }
})

//=================POST==========================
//Route to send POST request to login endpoint
router.post('/login', async (req, res) => {
    console.log(res.body);
    console.log('User Login');

    try {
        const {username, password} = req.body;
        const user = await User.findOne({username, password})
        console.log(user);

        if (password === user.password) {
            const jwtToken = jwt.sign(
                {userId: user._id},
                'secretKey',
                /*process.env.JWT_SECRET, */
                {
                    expiresIn: '12h',
                    algorithm: 'HS256',
                }
            )
            res.json({'token' : jwtToken})
        } else {
            throw new Error('Password Incorrect')
        }

    } catch (error) {
        console.error('Login Failed: Username or password are incorrect');
        res.status(401).json({ message: 'User not authenticated' })
    }
})

//Route to send a POST request the register endpoint
router.post('register', async (req, res) => {
    console.log(req.body);
    try {
        const { username, email, dateOfBirth, password, admin = false } = req.body;
        if (!username || !email || !dateOfBirth || !password) {
            console.error('Username and password are required');
            return res.status(400).json(
                { message: 'Username and password are required' }
            );
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json(
                { message: 'Username already exists' }
            );
        };
        const newUser = new User({
            username,
            email,
            dateOfBirth,
            admin,
            password
        });

        const savedUser = await newUser.save();

        const token = jwt.sign(
            { _id: savedUser._id },
            'secretKey',
            /*process.env.JWT_SECRET,*/
            {
                expiresIn: '12h',
                algorithm: 'HS256'
            }
        );

        res.status(201).json({ token, user: savedUser });
        console.log(savedUser);
    } 
    catch (error) {
        console.error('Failed to add User');
        return res.status(500).json(
            { error: 'Internal Server Error' }
        )
    }
})