const labModel = require("../models/labModel");

const addLab=async(req,res)=>{
    const {labName,labNumber,images,department,equipment} =req.body
    try {
        const isLabExist=await labModel.findOne({labNumber});
        if(isLabExist){
            return res.status(404).send({success:false,error:"Lab is Already exist"})
        }
        const newLab=new labModel({
            labName,
            labNumber,
            images,
            department,
            equipment
        })
        const addedLab=await newLab.save();
        res.status(200).send({success:true,message:"Lab Added Successfully..",lab:addedLab})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}


const deleteLab=async(req,res)=>{
    const {id}=req.params;
    try {
        const isLabExist=await labModel.findById(id);
        if(!isLabExist){
            return res.status(404).send({success:false,error:"Lab Not Found"})
        }
        const deletedLab=await labModel.findByIdAndDelete(id);
        res.status(200).send({success:true,lab:deletedLab,message:"Lab Deleted"})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}

const updateLab=async(req,res)=>{
    const {id}=req.params;
    try {
        const isLabExist=await labModel.findById(id);
        if(!isLabExist){
            return res.status(404).send({success:false,error:"Lab Not Found"})
        }
        const updatedLab=await labModel.findByIdAndUpdate(id,req.body)
        res.status(200).send({success:true,updatedLab:updatedLab,message:"Lab is Updated"})
    } catch (error) {
        console.log(error);
        re.status(500).send({success:false,error:error.message})
    }
}


const getAllLabs=async (req,res)=>{
    try {
        const allLabs=await labModel.find();
        if(allLabs.length<1){
            return res.status(200).send({success:true,message:"No Labs Added"})
        }
        res.status(200).send({success:true,allLabs})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}


const getSingleLab=async(req,res)=>{
    const {id}=req.params;
    try{
        const lab=await labModel.findById(id);
        if(!lab){
            return res.status(404).send({success:false,error:"Lab Not Found"})
        }
        res.status(200).send({success:true,lab})
    }catch(error){
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}



module.exports={addLab,updateLab,deleteLab,getAllLabs,getSingleLab}