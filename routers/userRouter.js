const { registerUser, emailVerification, userLogin, userAuth, getAllUsers, updateProfile, contactUs, changePassword, logout, forgetPassword, resetPassword,  } = require("../controllers/userController");
const verifyAdminToken = require("../middleware/adminMiddleware");
const { verifyToken } = require("../middleware/userMiddleware");

const router=require("express").Router();

router.post("/register",registerUser)
router.post("/account-verification",emailVerification)
router.post("/login",userLogin);
router.get("/verify",verifyToken,(req,res)=>res.send("Verified"))
// router.post("/register-complain",verifyToken,registerComplaints)
router.get("/verifyingUser",verifyToken,userAuth);
router.get("/allUsers",verifyAdminToken,getAllUsers)
router.post("/updateProfile",verifyToken,updateProfile)
router.post("/contactUs",contactUs)
router.put("/changePassword",verifyToken,changePassword)
router.post("/forget-password",forgetPassword);
router.post("/reset-password",resetPassword);
router.get("/logout",verifyToken,logout)

module.exports=router;