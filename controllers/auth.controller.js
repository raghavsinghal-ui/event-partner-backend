const express = require("express");
const userModel = require("../models/user.models");
const otpModel = require("../models/otp.models");
const sendotp = require("../utils/otp");
const Invite = require("../models/inviteToken.models");
const jwt = require("jsonwebtoken");
const {generateHash,compareHash} = require("../utils/hash");
const {generateAccessToken,generateRefreshToken}=require("../utils/generateToken");

  function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const getToken=(user)=>{
    const accessToken=generateAccessToken(user);
    const refreshToken=generateRefreshToken(user);
    return {accessToken,refreshToken};
}
exports.signup = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      contactNo,
    } = req.body;


   

    if (!name || !email || !password || !contactNo ) {
      return res.status(400).json({
        message: "All required fields missing"
      });
    }
    let role = "normal";
    if(req.query.token){
        const invite = await Invite.findOne({ token: req.query.token });
        if (!invite) {
            return res.status(400).json({ message: "Invalid invite token" });
        } 
        if (invite.expiresAt < new Date()) {
            return res.status(400).json({ message: "Invite token expired" });
        }
        role = invite.role;
        
        await Invite.deleteOne({ _id: invite._id });
    }

  
    const exist = await  userModel.findOne({ email });

    if (exist) {
      return res.status(400).json({
        message: "User already exists"
      });
    }
    const cooldown =  10 * 1000*60; // 5 min
const now = new Date();

const existing = await otpModel.findOne({ email });

if (existing) {
  const nextAllowedTime = existing.createdAt.getTime() + cooldown;

  if (now.getTime() < nextAllowedTime) {
    return res.status(429).json({
      message: "Cooldown active. Try later."
    });
  }
}

    const otp =  generateOtp();
    // 4. delete old OTP if exists
 const saved= await otpModel.findOneAndUpdate(
  { email },
  { email,otp, createdAt: new Date(), role },
  { upsert: true, new: true }
);

   
   await sendotp(email,otp);



    res.status(200).json({
      message: "OTP sent successfully",
     
    });


  }
  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


exports.login=async(req,res)=>{
    try{
const{email,password}=req.body;
if(!email || !password){
    return res.status(400).json({message:"Email and password are required"});
}
const user=await userModel.findOne({email}).select("+password");
if(!user){
    return res.status(400).json({message:"User not found"});
}

const isMatch=await compareHash(password,user.password);
if(!isMatch){
    return res.status(400).json({message:"Invalid password"});
}

const {accessToken,refreshToken}=getToken(user);
user.refreshToken=refreshToken;
user.refreshTokenExpiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
);
await user.save({ validateBeforeSave: false });
 res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
res.status(200).json({
    message:"Login successful",
    accessToken,
   
})

    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}
exports.verifyOtp = async (req, res) => {
  try {

    let {
      name,
      email,
      password,
      contactNo,
      otp
    } = req.body;

    email = email.trim().toLowerCase();
    otp = String(otp);


    const otpRecord = await otpModel.findOne({ email });


    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP expired or not found"
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }


    const user = await userModel.create({
      name,
      email,
      password: await generateHash(password),
      contactNo,
      role: otpRecord.role
      
    });

    await otpModel.deleteOne({ email });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.refreshToken=async(req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;;
        if(!refreshToken){
            return res.status(400).json({message:"Refresh token is required"});
        }
     
        const decoded=jwt.verify(refreshToken,process.env.JSONWEBTOKEN_SECRET_REFRESH);
        const user=await userModel.findById(decoded.id);  
          
        if(!user || user.refreshToken!==refreshToken){
            return res.status(400).json({message:"Invalid refresh token"});
        }   
         if (user.refreshTokenExpiresAt < Date.now()) {

    return res.status(401).json({
        success: false,
        message: "Refresh token expired"
    });
}
        const newAccessToken=generateAccessToken(user);
        
        res.status(200).json({
            accessToken:newAccessToken
        })
    } catch (error) {     
        res.status(500).json({message: error.message});
    }
}