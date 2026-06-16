const express=require("express");
const router=express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const {createOrder,verifyPayment }=require("../controllers/payment.controller");
router.post("/createOrder", authMiddleware, createOrder);
router.get("/verify-payment", authMiddleware, verifyPayment);

module.exports=router;