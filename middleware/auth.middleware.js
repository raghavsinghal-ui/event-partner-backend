const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (req, res, next) => {
    try {
       
        const token= req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token required"
            });
        }

 
        const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET);
  
        req.user = decoded;

     
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

