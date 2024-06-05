const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Initialize dotenv to use .env variables
dotenv.config();

const auth = (req, res, next) => {
    const token = req.cookies["auth_token"];
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "unauthorized" });
    }
};

module.exports = auth;