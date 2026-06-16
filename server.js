require("dotenv").config();
const express=require("express");
const connectDB=require("./config/db")
const app=require("./app")




connectDB();
const port=process.env.PORT;
app.listen(port,()=>{
    console.log("server started")
})