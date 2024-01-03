const { loginAdmin, registerAdmin, adminAuth, userAccess, userReport } = require("../controllers/adminController");
const verifyAdminToken = require("../middleware/adminMiddleware");


const router=require("express").Router();

router.post("/admin/register",registerAdmin)
router.post("/admin/login",loginAdmin)
router.get("/admin/protected",verifyAdminToken,(req,res)=>res.send({message:"Admin is Protected and verified"}))
router.get("/adminAuth",verifyAdminToken,adminAuth)
router.post("/userAccess",verifyAdminToken,userAccess);
router.post("/userReport",verifyAdminToken,userReport)

module.exports=router;