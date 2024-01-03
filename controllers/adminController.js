const adminModel = require("../models/adminModel");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();


const registerAdmin=async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        const isEmailExist=await adminModel.findOne({email});
        if(isEmailExist){
            return res.status(404).send({success:false,error:"email is already registered"})
        }
        const encrypt=await bcrypt.hash(password,10);
        const newAdmin=new adminModel({
            name,
            email,
            password:encrypt
        })
        const adminRegistered=await newAdmin.save();
        res.status(200).send({success:true,adminRegistered})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}


const loginAdmin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const admin=await adminModel.findOne({email});
        if(!admin){
            return res.status(404).send({success:false,error:"INVALID CREADTIAL"})
        }
        const match=await bcrypt.compare(password,admin.password);
        if(!match){
            return res.status(404).send({success:false,error:"INVALID CREADTIAL"})
        }

        const token =await jwt.sign({adminId:admin._id},process.env.SECRET_KEY);
        res.cookie("adminToken",token,{ httpOnly: true, maxAge:60*60*1000 })

        admin.token=token;
        await admin.save();
        res.status(200).send({success:true,logIn:admin})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}

const adminAuth = async (req, res) => {
    try {
        const token = req.cookies.adminToken;
        const decodedToken = jwt.decode(token);

        const admin = await adminModel.findById(decodedToken.adminId);
        if (!admin) {
            return res.status(400).send({ success: false, error: "Admin Not in Database" });
        }

        return res.status(200).send({ success: true, admin: admin });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message });
    }
}



const userAccess=async(req,res)=>{
    const {id}=req.body;
    try{
      const user=await userModel.findById(id);
      user.adminAllowed=true;
      await user.save();
      console.log(user)
      res.status(200).send({success:true,user})
    }catch(error){
      console.log(error)
      res.status(500).send({success:false,error:error.message})
    }
  }


  const userReport=async(req,res)=>{
    const {id}=req.body;
    try{
      const user=await userModel.findById(id);
      if (!user) {
        return res.status(404).send({ success: false, error: "User not found" });
      }
      user.adminAllowed=false;
      await user.save();
      console.log(user)
      res.status(200).send({success:true,user})
    }catch(error){
      console.log(error)
      res.status(500).send({success:false,error:error.message})
    }
  }


module.exports={registerAdmin,loginAdmin,adminAuth,userAccess,userReport}