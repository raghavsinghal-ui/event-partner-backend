const authRoles = (...allowedRoles) => {

    return (req, res, next) => {

        try {

        
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }

            next();

        } catch (error) {

            console.log("Role middleware error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
};

module.exports = authRoles;