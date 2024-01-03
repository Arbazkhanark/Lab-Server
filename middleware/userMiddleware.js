const jwt=require("jsonwebtoken")
require("dotenv").config()

const verifyToken=(req,res,next)=>{
    const token=req.cookies.token;
    console.log(token);
    try {
        if(!token){
            return res.status(404).send({success:false,error:"Log In First"})
        }

        const verified=jwt.verify(token,process.env.SECRET_KEY);
        if(verified){
            req.user=verified;
            next();
        }else{
            return res.status(400).send({success:false,error:"Token is Invalid"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:"Internal Server Error"});
    }
}

module.exports={verifyToken}