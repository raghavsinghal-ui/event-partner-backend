const express = require("express");
const router = express.Router();


const { signup,verifyOtp,login,refreshToken} = require("../controllers/auth.controller");


router.post("/signup", signup);


router.post("/verify-otp",  verifyOtp);

router.post("/login", login);


router.post("/refresh-token", refreshToken);

module.exports = router;