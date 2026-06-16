const express = require("express");
const router = express.Router();
const authRoles= require("../middleware/role.middleware");
const  {authMiddleware} = require("../middleware/auth.middleware");
const {  getProfile,completeProfile ,needTovalidate,verifyUser} = require("../controllers/Profile.controller");

router.get("/get", authMiddleware, getProfile);
router.put("/complete", authMiddleware, completeProfile);
router.get("/pending", authMiddleware, authRoles("admin"), needTovalidate);
router.post("/verify/:userId", authMiddleware, authRoles("admin"), verifyUser);

module.exports=router;