const express=require("express");
const dbConnection = require("./database");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors=require("cors");
const path=require("path")

const userRouter=require("./routers/userRouter")
const adminRouter=require("./routers/adminRouter")
const labRouter=require("./routers/labRouter")
const complainRouter=require("./routers/complainRouter")
const workerRouter=require("./routers/workerRouter")


const app=express();
dbConnection()
app.use(express.static(path.resolve(__dirname,"dist")))

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  
app.use(cookieParser())


app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"dist",'index.html'))
})

// app.use(require("./routers/userRouter"))
// app.use(require("./routers/adminRouter"))
// app.use(require("./routers/labRouter"))
// app.use(require("./routers/complainRouter"))
// app.use(require("./routers/workerRouter"))

app.use("/api",userRouter)
app.use("/api",adminRouter)
app.use("/api",labRouter)
app.use("/api",complainRouter)
app.use("/api",workerRouter)

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server is running on PORT: ${PORT}`))