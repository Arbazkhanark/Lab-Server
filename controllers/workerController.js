const workerModel = require("../models/workerModel");
const mongoose =require("mongoose")
const nodemailer=require("nodemailer");
const complainModel = require("../models/complainModel");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const addWorker=async(req,res)=>{
    const {name,email}=req.body;
    try{
        const worker=await workerModel.findOne({email});
        if(worker){
            return res.status(404).send({success:false,error:"Worker Already Exist.."})
        }
        const newWorker=new workerModel({
            name,
            email
        })
        const addedWorker=await newWorker.save()
        res.status(200).send({success:true,worker:addedWorker})
    }catch(error){
        console.log(error)
        res.status(500).send({success:false,error:error.message})
    }
}

const updateWorker=async(req,res)=>{
    const {id}=req.params;
    try{
        const updated=await workerModel.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).send({success:true,updated})
    }catch(error){
        console.log(error)
        res.status(500).send({success:false,error:error.message})
    }
}


const deleteWorker=async(req,res)=>{
    const {id}=req.params;
    try{
        const worker=await workerModel.findById(id);
        if(!worker){
            return res.status(404).send({success:false,error:"Worker is Not in Database.."})
        }

        const deleted=await workerModel.findByIdAndDelete(id)
        res.status(200).send({success:true,deleted})
    }catch(error){
        console.log(error)
        res.status(500).send({success:false,error})
    }
}


const getAllWorker=async(req,res)=>{
    try{
        const workers=await workerModel.find();
        if(workers.length<1){
            return res.status(400).send({success:true,error:"No Workers"})
        }
        res.status(200).send({success:true,workers});
    }catch(error){
        console.log(error);
        res.status(500).send({success:false,error})
    }
}


const assignedWorker = async (req, res) => {
    const { email, complainId } = req.body;
  
    try {
      const worker = await workerModel.findOne({ email });
      if (!worker) {
        return res.status(404).send({ success: false, error: "TECHNICIAN NOT FOUND" });
      }
  
      const complaint = await complainModel.findById(complainId).populate({path:"lab", select:"labName"});

      console.log(complaint)
      if (!complaint) {
        return res.status(404).send({ success: false, error: "COMPLAINT NOT FOUND" });
      }
  
  
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Complaint Assigned',
        html: `
          <p>Dear ${worker.name},</p>
          <p>You have been assigned a new complaint.</p>
          <p>Complaint Id: ${complaint._id}</p>
          <p>Lab Name: ${complaint.lab.labName}</p>
          <p>Equipments: ${complaint.equipment}</p>
          <p>Issue Type: ${complaint.issueType}</p>
          <p>Urgency Level: ${complaint.urgencyLevel}</p>
          <img src="${complaint.images[0]}" width="200px" alt="img" />
        `,
      };
      
  
      await transporter.sendMail(mailOptions);
      worker.complaints.push(complaint)
      await worker.save()
      res.status(200).send({ success: true, worker });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error: error.message });
    }
  };
  


module.exports={addWorker,updateWorker,deleteWorker,getAllWorker,assignedWorker}