const { addWorker, updateWorker, deleteWorker, getAllWorker, assignedWorker } = require("../controllers/workerController");
const verifyAdminToken = require("../middleware/adminMiddleware");

const router=require("express").Router();

router.post("/addWorker",verifyAdminToken,addWorker)
router.put("/updateWorker/:id",verifyAdminToken,updateWorker)
router.delete("/deleteWorker/:id",verifyAdminToken,deleteWorker)
router.get("/allWorkers",getAllWorker);
router.post("/assignedWork",verifyAdminToken,assignedWorker)




module.exports=router;