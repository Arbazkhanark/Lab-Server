const mongoose=require("mongoose");

 const dbConnection=()=>{
    try {
        const db=mongoose.connect(process.env.DB)
        console.log("Database Connected :)");
    } catch (error) {
        console.log("Connection Failed: ",error)
    }
}


module.exports=dbConnection