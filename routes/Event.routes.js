const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const authRoles = require("../middleware/role.middleware");
const { generatePost,checkReq,trackRegistration,editEventDetails} = require("../controllers/Event.controller");



router.post("/generatePost",  authMiddleware,authRoles("super_admin","admin"), generatePost);
router.get("/check/:eventId", authMiddleware, checkReq);
router.put("/edit/:eventId", authMiddleware, authRoles("super_admin","admin"), editEventDetails);
router.get("/track-registration/:eventId", authMiddleware, authRoles("super_admin","admin"), trackRegistration);

module.exports = router;