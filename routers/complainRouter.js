const { registerComplaints, updateComplainStatus, getAllComplains } = require("../controllers/complainController");
const verifyAdminToken = require("../middleware/adminMiddleware");
const { verifyToken } = require("../middleware/userMiddleware");

const router=require("express").Router();


router.post("/register-complain",verifyToken,registerComplaints);
router.post("/admin/complaintStatus/:complaintId",verifyAdminToken,updateComplainStatus);
router.get("/admin/allComplains",verifyAdminToken,getAllComplains)


module.exports=router