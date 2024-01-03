const mongoose=require("mongoose");

const labSchema=new mongoose.Schema({
    labName: { type: String, required: true },
    labNumber: { type: String, required: true, unique: true },
    department: { type: String },
    equipment: [{ type: String }],
    images:[String]
    // capacity: { type: Number },
})

const labModel= mongoose.model("Lab",labSchema);
module.exports=labModel;