const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };