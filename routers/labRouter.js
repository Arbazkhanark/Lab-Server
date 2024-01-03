const { getAllLabs, addLab, updateLab, deleteLab, getSingleLab } = require("../controllers/labController");
const verifyAdminToken = require("../middleware/adminMiddleware");

const router=require("express").Router();

router.get("/all_Labs",getAllLabs);
router.post("/add-lab",verifyAdminToken,addLab);
router.get("/singleLab/:id",getSingleLab);
router.put("/updateLab/:id",verifyAdminToken,updateLab);
router.delete("/deleteLab/:id",verifyAdminToken,deleteLab);


module.exports=router;