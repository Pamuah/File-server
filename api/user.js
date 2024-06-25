const express = require('express');
const router = express.Router();
const user = require('./../models/user'); // Import the user model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Route for user signup
router.post('/signup', (req, res) => {
    // Destructure and trim input fields
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    // Validate input fields
    if (name == '' || email == '' || password == '') {
        res.json({
            status: 'FAILED',
            message: 'Please fill all the fields'
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid name entered'
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid email entered'
        });
    } else if (password.length < 6) {
        res.json({
            status: 'FAILED',
            message: 'Password should be at least 6 characters'
        });
    } else {
        // Check if the user already exists
        user.find({ email })
            .then((result) => {
                if (result.length > 0) {
                    res.json({
                        status: 'FAILED',
                        message: 'User already exists'
                    });
                } else {
                    // Hash the password
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds)
                        .then(hashedPassword => {
                            // Create a new user with the hashed password
                            const newUser = new user({
                                name,
                                email,
                                password: hashedPassword,
                            });
                            // Save the new user to the database
                            newUser.save()
                                .then(result => {
                                    res.json({
                                        status: 'SUCCESS',
                                        message: 'User created successfully'
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.json({
                                        status: 'FAILED',
                                        message: 'An error occurred while saving user account'
                                    });
                                });
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({
                                status: 'FAILED',
                                message: 'An error occurred while hashing password'
                            });
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    status: 'FAILED',
                    message: 'An error occurred while checking for existing user'
                });
            });
    }
});

// Route for user login
router.post('/signin', (req, res) => {
    // Destructure and trim input fields
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    // Validate input fields
    if (email == '' || password == '') {
        res.json({
            status: 'FAILED',
            message: 'Please fill all the fields'
        });
    } else {
        // Check if the user exists
        user.find({ email })
            .then(data => {
                if (data.length) {
                    const hashedPassword = data[0].password;
                    // Compare the input password with the hashed password
                    bcrypt.compare(password, hashedPassword)
                        .then(result => {
                            if (result) {
                                res.json({
                                    status: 'SUCCESS',
                                    message: 'Login successful'
                                });
                            } else {
                                res.json({
                                    status: 'FAILED',
                                    message: 'Invalid password'
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({
                                status: 'FAILED',
                                message: 'An error occurred while comparing passwords'
                            });
                        });
                } else {
                    res.json({
                        status: 'FAILED',
                        message: 'Invalid credentials entered'
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.json({
                    status: 'FAILED',
                    message: 'An error occurred while checking for existing user'
                });
            });
    }
});

module.exports = router; // Export the router
