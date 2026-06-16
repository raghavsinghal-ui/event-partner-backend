const express=require('express');
const router=express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const authRoles = require("../middleware/role.middleware");

const{invite,demoteUser}=require('../controllers/admin.controller');
router.get('/link', authMiddleware, authRoles("super_admin"), invite);
router.post('/demote', authMiddleware, authRoles("super_admin"), demoteUser);
module.exports=router;