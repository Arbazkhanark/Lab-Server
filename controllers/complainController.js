const labModel = require("../models/labModel");
const complainModel = require("../models/complainModel");
const nodemailer=require("nodemailer");
const userModel = require("../models/userModel");


const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})



// const registerComplaints = async (req, res) => {
//   const { labName, issueType, equipment, details, images, hardwareIssueDetails, urgencyLevel,softwareIssueDetails } = req.body;

//   try {
//     // Check if any required field is missing
//     if (!labName || !issueType || !equipment || !details || !images || !urgencyLevel) {
//       return res.status(400).send({ success: false, error: "All fields are required" });
//     }

//     // Find the lab based on labName
//     const lab = await labModel.findOne({ labName });

//     // Check if the lab exists
//     if (!lab) {
//       return res.status(404).send({ success: false, error: "Lab not found" });
//     }

//     // Create a new complaint
//     const newComplaint = new complainModel({
//       user: req.user.userId,
//       issueType,
//       lab: lab._id,
//       equipment,
//       images,
//       hardwareIssueDetails,
//       softwareIssueDetails,
//       urgencyLevel,
//       details,
//       timestamp: new Date(),
//     });

//     // Save the new complaint
//     await newComplaint.save();

//     // Send a success response
//     res.status(200).send({ success: true, message: "Complaint registered successfully", complaint: newComplaint });
//   } catch (error) {
//     // Handle errors
//     console.error(error);

//     // Send an error response
//     res.status(500).send({ success: false, error: error.message });
//   }
// };



const registerComplaints = async (req, res) => {
  const { labName, issueType, equipment, details, images, hardwareIssueDetails, urgencyLevel, softwareIssueDetails } = req.body;

  try {
    // Check if any required field is missing
    if (!labName || !issueType || !equipment || !details || !images || !urgencyLevel) {
      return res.status(400).send({ success: false, error: "All fields are required" });
    }

    // Find the lab based on labName
    const lab = await labModel.findOne({ labName });

    // Check if the lab exists
    if (!lab) {
      return res.status(404).send({ success: false, error: "Lab not found" });
    }

    // Create a new complaint
    const newComplaint = new complainModel({
      user: req.user.userId,
      issueType,
      lab: lab._id,
      equipment,
      images,
      hardwareIssueDetails,
      softwareIssueDetails,
      urgencyLevel,
      details,
      timestamp: new Date(),
    });

    // Save the new complaint
    await newComplaint.save();

    // Send an email to the user
    const user=await userModel.findById(req.user.userId)
    console.log(user)
    sendEmailToUser(user.email, "Complaint Registered", "Thank you for registering a complaint. We will review it shortly.");

    // Send a success response
    res.status(200).send({ success: true, message: "Complaint registered successfully", complaint: newComplaint });
  } catch (error) {
    // Handle errors
    console.error(error);

    // Send an error response
    res.status(500).send({ success: false, error: error.message });
  }
};

// Function to send an email to the user
const sendEmailToUser = async (to, subject, text) => {
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent to', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// const updateComplainStatus = async (req, res) => {
//   const { complaintId } = req.params;
//   const { newStatus } = req.body;

//   try {
//     const complaint = await complainModel.findById(complaintId);
//     if (!complaint) {
//       return res.status(404).send({ success: false, error: "Complaint not found" });
//     }

//     if (complaint.status === "Resolved" && newStatus === "Pending") {
//       return res.status(400).send({ success: false, error: "Cannot update status to Pending for a resolved complaint" });
//     }

//     const user = await userModel.findById(complaint.user);

//     let subject, text;
//     switch (newStatus) {
//       case "Pending":
//         subject = "Complaint Status Update - Pending";
//         text = `Your complaint status has been updated to Pending. Thank you for your patience.`;
//         break;
//       case "Resolved":
//         subject = "Complaint Status Update - Resolved";
//         text = `Your complaint has been resolved. If you have any further concerns, feel free to contact us.`;
//         break;
//       case "Assigned":
//         subject = "Complaint Status Update - Assigned";
//         text = `Your complaint has been assigned. Our team is working on it. We will keep you updated on the progress.`;
//         break;
//       default:
//         subject = "Complaint Status Update";
//         text = `Your complaint status has been updated.`;
//     }

//     const mailOption = {
//       from: process.env.SMTP_USER,
//       to: user.email,
//       subject,
//       text,
//     };

//     await transporter.sendMail(mailOption);

//     complaint.status = newStatus;
//     await complaint.save();

//     res.status(200).send({ success: true, message: "Complaint status updated successfully", complaint });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, error: "Internal Server Error" });
//   }
// };


const updateComplainStatus = async (req, res) => {
  const { complaintId } = req.params;
  const { newStatus} = req.body;

  console.log(newStatus)
  try {
    const complaint = await complainModel.findById(complaintId);
    if (!complaint) {
      return res.status(404).send({ success: false, error: "Complaint not found" });
    }

    if(complaint.status === newStatus){
      return res.status(400).send({ success: false, error: `Status already ${newStatus}` });      
    }

    if (complaint.status === "Pending" && newStatus === "Resolved") {
      return res.status(400).send({ success: false, error: "Cannot update status directly to Resolved for a Pending complaint" });
    }

    if (complaint.status === "Resolved" && newStatus === "Pending") {
      return res.status(400).send({ success: false, error: "Cannot update status to Pending for a resolved complaint" });
    }

    if (complaint.status === "Resolved" && newStatus === "Assigned") {
      return res.status(400).send({ success: false, error: "Cannot update status to Assigned for a resolved complaint" });
    }

    const user = await userModel.findById(complaint.user);

    let subject, text;
    switch (newStatus) {
      case "Pending":
        subject = "Complaint Status Update - Pending";
        text = `Your complaint status has been updated to Pending. Thank you for your patience.`;
        break;
      case "Resolved":
        subject = "Complaint Status Update - Resolved";
        text = `Your complaint has been resolved. If you have any further concerns, feel free to contact us.`;
        break;
      case "Assigned":
        subject = "Complaint Status Update - Assigned";
        text = `Your complaint has been assigned. Our team is working on it. We will keep you updated on the progress.`;
        break;
      default:
        subject = "Complaint Status Update";
        text = `Your complaint status has been updated.`;
    }

    const mailOption = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject,
      text,
    };

    await transporter.sendMail(mailOption);

    complaint.status = newStatus;
    await complaint.save();

    res.status(200).send({ success: true, message: "Complaint status updated successfully", complaint });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

  


// const updateComplainStatus = async (req, res) => {
//   const { complaintId } = req.params;
//   const { newStatus } = req.body;

//   try {
//     const complaint = await complainModel.findById(complaintId);
//     if (!complaint) {
//       return res.status(404).send({ success: false, error: "Complaint not found" });
//     }

//     const allowedStatusTransitions = {
//       Pending: ["Assigned"],
//       Assigned: ["Resolved"],
//       Resolved: [], // No further transitions from Resolved
//     };

//     if (!allowedStatusTransitions[complaint.status]?.includes(newStatus)) {
//       return res.status(400).send({ success: false, error: "Invalid status transition" });
//     }

//     const user = await userModel.findById(complaint.user);

//     let subject, text;
//     switch (newStatus) {
//       case "Pending":
//         subject = "Complaint Status Update - Pending";
//         text = `Your complaint status has been updated to Pending. Thank you for your patience.`;
//         break;
//       case "Assigned":
//         subject = "Complaint Status Update - Assigned";
//         text = `Your complaint has been assigned. Our team is working on it. We will keep you updated on the progress.`;
//         break;
//       case "Resolved":
//         subject = "Complaint Status Update - Resolved";
//         text = `Your complaint has been resolved. If you have any further concerns, feel free to contact us.`;
//         break;
//       default:
//         subject = "Complaint Status Update";
//         text = `Your complaint status has been updated.`;
//     }

//     const mailOption = {
//       from: process.env.SMTP_USER,
//       to: user.email,
//       subject,
//       text,
//     };

//     await transporter.sendMail(mailOption);

//     complaint.status = newStatus;
//     await complaint.save();

//     res.status(200).send({ success: true, message: "Complaint status updated successfully", complaint });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, error: "Internal Server Error" });
//   }
// };


  const getAllComplains=async(req,res)=>{
    try {
        const complains=await complainModel.find().populate({
          path:"user",
          select:["name","email","urn"]
        }).populate({
          path:"lab",
          select:"labName"
        });
        if(complains.length<1){
            return res.status(404).send({success:false,error:"No Complains YET.."})
        }
        res.status(200).send({success:true,complains})
    } catch (error) {
        console.log(error)
        res.status(500).send({success:false,error:error})
    }
  }


  





module.exports = { registerComplaints, updateComplainStatus,getAllComplains };
