const express=require("express");
const router=express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const authRoles = require("../middleware/role.middleware");
const {createForm,getForm,submitForm }=require("../controllers/form.contoller");



router.post("/create", authMiddleware, authRoles("super_admin","admin"), createForm);
router.post("/submit", authMiddleware, submitForm);

router.get('/get', authMiddleware, getForm);
module.exports=router;