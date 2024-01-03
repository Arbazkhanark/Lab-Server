const jwt=require("jsonwebtoken")
require("dotenv").config();

const verifyAdminToken=async(req,res,next)=>{
    const token=req.cookies.adminToken;
    try {
        const verified=await jwt.verify(token,process.env.SECRET_KEY);
        if(verified){
            req.admin=verified;
            next();
        }else{
            return res.status(400).send({success:false,error:"Token is Invalid"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}

module.exports=verifyAdminToken