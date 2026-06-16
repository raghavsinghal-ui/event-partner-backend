const express=require('express');
const router=express.Router();
const {authMiddleware}=require("../middleware/auth.middleware");
const{listEvent,searchEvents }=require('../controllers/getEvents.controller');
router.get('/listEvent', authMiddleware, listEvent);
router.get('/searchEvents', authMiddleware, searchEvents);
module.exports=router;