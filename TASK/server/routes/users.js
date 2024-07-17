// Import necessary modules and packages
const express = require('express');// Import Express Web framework 
const router = express.Router();// Create an Express router
/*
The express.Router() function is used to create a new router object. 
This function is used to create a new router object to handle requests. 
*/
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('../models/userSchema')

//=========SETUP MIDDLEWARE==========
router.use(express.json()); // Parse incoming request bodies in JSON format
/*Built-Middleware function used to parse incoming requests with JSON payloads.
Returns middleware that only parses JSON and only looks at requests where the
Content-Type header matches the type option.*/
router.use(cors()); //Enable Cross-Origin Resource sharing 

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
    console.log('Finding user');// Log a message in the console for debugging purposes
    try {
        // Retrieve user details using the authenticated user ID from req.user.userId
        const user = await User.findById(req.user.userId);

    //Conditional rendering to check if the user exists
         if (!user) {
            console.error('User not found');//Log an error message in the console for debugging purposes
            return res.status(400).json(// Return a JSON response with a 400 status code and 'User Not Found' message.
                { message: 'User Not Found'}
            )
         }
        
        res.status(200).json(user);//If the user is found, sends a JSON response with the user details and a 200 status code (OK).
        console.log('User details', user);//Log the user details to the console for debugging purposes.
        
    } 
    catch (error) {
     console.error('Error fetching Users', error.message);// Log error message in the console for debugging purposes
        /* If an error occurs during database operation, 
    return a 500 Internal Server Error response*/
        res.status(500).json(
            {message: 'Internal Server Error', error: error.message}
        )
    }
})

//Route to handle a GET request to fetch all users
router.get('/findUsers', async (req, res) => {
    console.log('Finding users');//Log a message in the console for debugging purposes
    try {
        const {username} = req.query;// Extract the username from query parameters
        const query = username ? {username} : {};// Create a MongoDB query object based on whether username is provided or not
        const users = await User.find(query);// Using the User model to find users based on the query

        console.log(users);//Log the fetched users to the console for debugging purposes
        res.status(200).json(users);// Send a JSON response with the found users and a 200 (OK) status code
    } catch (error) {
        console.error('Error fetching users');// Log error message in the console for debugging purposes
        res.status(500).json({message: 'Internal Server Error'});// Send a 500 (Internal Server Error)status code and an error message in case of an error
    }
})

//=================POST==========================
//Route to send POST request to login endpoint
router.post('/login', async (req, res) => {
    console.log(res.body);// Log the request body containing the username and password
    console.log('User Login');// Log a message in the console indicating user login for debugging purposes

    try {
        const {username, password} = req.body;// Extract username and password from the request body
        const user = await User.findOne({username, password});// Find the user in the database by username and password
        console.log(user);// Log a message in the console indicating user login for debugging purposes

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
router.post('/register', async (req, res) => {
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
