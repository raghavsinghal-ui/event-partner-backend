const jsonwebtoken=require("jsonwebtoken");
function generateAccessToken(user) {
    const token = jsonwebtoken.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JSONWEBTOKEN_SECRET,
        { expiresIn: '1h' }
    );
    return token;
}
function generateRefreshToken(user) {
    const token = jsonwebtoken.sign(
        { id: user._id, email: user.email },
        process.env.JSONWEBTOKEN_SECRET_REFRESH,
        { expiresIn: '7d' }
    );
    return token;
}
module.exports = {
    generateAccessToken,
    generateRefreshToken
};