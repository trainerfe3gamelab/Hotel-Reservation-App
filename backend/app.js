const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const auth = require('./backend/middleware/auth');

// Initialize dotenv to use .env variables
dotenv.config();

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// Example route to demonstrate verifyToken middleware
app.get('/protected', auth, (req, res) => {
    res.json({ message: "This is a protected route", userId: req.userId });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});