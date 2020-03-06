const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const verifyToken = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader != "undefined") {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 's3cr3tk3y', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: "Post created...",
                authData
            });
        }
    });
});

app.post('/api/login', (req, res) => {
    // Mock user
    const user = {
        _id: 1,
        username: "John",
        password: "j0hn"
    };
    jwt.sign({ user }, 's3cr3tk3y', { expiresIn: '10m' }, (err, token) => {
        res.json({ token });
    } )
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});