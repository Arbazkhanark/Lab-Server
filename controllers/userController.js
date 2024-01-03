const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    contact,
    department,
    gender,
    urn
  } = req.body;
  console.log(name);
  const otp = generateOTP();
  const otpExpire = new Date(+new Date() + 5 * 60 * 1000); // Set the OTP expiry to 5 minutes from now
  try {
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return res
        .status(400)
        .send({ success: false, error: "Email already Exist" });
    }
    const encrypt = await bcrypt.hash(password, 10);
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({
          success: false,
          error: "Password and Confirm Password should be the same",
        });
    }

    const newUser = new userModel({
      name,
      email,
      password: encrypt,
      confirmPassword: encrypt,
      department,
      gender,
      urn,
      contact,
      avatar: {
        public_id: "adbjhsbjhdcdc",
        url: "cjsdnkjcdsc",
      },
      otp, // Store OTP temporarily
      otpExpire,
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Account Verification",
      text: `Dear User,
          
                  Thank you for registering with our application. To verify your account, please use the following code:
          
                  Verification Code: ${otp}
          
                  If you did not register for an account, please ignore this email.
          
                  Thank you for choosing our service.
          
                  Regards,
                  Your Application Team`,
    };

    await transporter.sendMail(mailOptions);
    await newUser.save();
    res.status(200).send({ success: true, user: newUser, otpSent: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error });
  }
};

const emailVerification = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({ success: false, error: "User not found" });
    }

    if (user.verified) {
      return res
        .status(400)
        .send({ success: false, error: "User already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).send({ success: false, error: "Invalid OTP" });
    }

    user.verified = true;
    await user.save();
    res
      .status(200)
      .send({
        success: true,
        message: "User registered and verified successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, error: "INVALID CREADTIAL" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .send({ success: false, error: "INVALID CREADTIAL" });
    }
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    user.token = token;
    await user.save();
    res
      .status(200)
      .send({ success: true, message: "user login Successfully", login: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// const registerComplaints = async (req, res) => {
//     const { items } = req.body;
//     const userId = req.user.userId; // Assuming you have the userId available in the request (extracted from the JWT token)

//     try {
//       // Find the user by their ID
//       const user = await userModel.findById(userId);

//       if (!user) {
//         return res.status(404).send({ success: false, error: "User not found" });
//       }

//       // Create a new complaint
//       const newComplaint = {
//         items,
//         time: new Date(),
//       };

//       // Push the new complaint into the user's complains array
//       user.complains.push(newComplaint);

//       // Save the updated user object
//       await user.save();

//       res.status(200).send({ success: true, message: "Complaint registered successfully", user });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({ success: false, error: "Internal Server Error" });
//     }
//   };

const userAuth = async (req, res) => {
  const token = req.cookies.token;
  const decodeToken = await jwt.decode(token);
  console.log(decodeToken);
  try {
    const user = await userModel.findById(decodeToken.userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, error: "user not in Database" });
    }
    res.status(200).send({ success: true, user: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (users.length < 1) {
      return res.status(404).send({ success: false, error: "No Users Yet" });
    }
    res.status(200).send({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.user.userId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    res.status(200).send({ success: true, UpdatedProfile: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .send({ success: false, error: "Enter Required Fields" });
    }

    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    const compare = await bcrypt.compare(oldPassword, user.password);
    if (!compare) {
      return res
        .status(404)
        .send({ success: false, error: "old password is Invalid" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(404)
        .send({
          success: false,
          error: "New Password and Confirm Password should be same...",
        });
    }
    const encrypt = await bcrypt.hash(newPassword, 10);
    user.password = encrypt;
    user.confirmPassword = encrypt;
    await user.save();
    res.status(200).send({ success: true, user: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
};



const forgetPassword = async (req, res) => {
  const { email } = req.body;
  // console.log("@@2",email)
  try {
    const user = await userModel.findOne({ email });
    // console.log(user)
    if (!user) {
      return res.status(400).send({ success: false, error: "INVALID USER" });
    }

    const randomToken = await jwt.sign({ email }, process.env.RESET_TOKEN, {
      expiresIn: "5m",
    });
    // const resetTokenExpiration=Date.now()+300000;

    user.resetPasswordToken = randomToken;
    // user.resetPasswordExpire=resetTokenExpiration;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password?token=${randomToken}`;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Password",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({
        success: true,
        message: `Reset Password's Link sent to Email`,
        user: user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.query.token;
  const { newPassword, confirmPassword } = req.body;
  console.log("reset",token)
  try {
    const user = await userModel.findOne({ resetPasswordToken: token });
    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .send({
          success: false,
          error: "User not found with the provided token",
        });
    }
    const encrypt = await bcrypt.hash(newPassword, 10);
    const match = await bcrypt.compare(confirmPassword, encrypt);

    if (!match) {
      return res
        .status(400)
        .send({
          success: false,
          error: "New Password and Confirm Password should be same",
        });
    }

    user.resetPasswordToken = "";
    user.password = encrypt;
    user.confirmPassword = encrypt;
    const updatedPassword = await user.save();
    res.status(200).send({ success: true, UpdatedUser: updatedPassword });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};



const contactUs = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    if (!name || !email || !message) {
      return res
        .status(400)
        .send({ success: false, error: "Enter Required Fields" });
    }
    if (!message || message.length < 10) {
      return res
        .status(400)
        .send({
          success: false,
          error: "Enter at least 10 letters in the message",
        });
    }
    const mailOption = {
      from: email,
      to: process.env.SMTP_USER,
      subject: `Hey Lab_Manager: A new message from ${name}`,
      text: message,
    };

    await transporter.sendMail(mailOption);
    res
      .status(200)
      .send({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
};


const logout = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(400)
        .send({ success: false, error: "User Already Log-Out" });
    }
    res.clearCookie("token");
    res.status(200).send({ success: true, message: "Log Out Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
};

module.exports = {
  registerUser,
  emailVerification,
  userLogin,
  userAuth,
  getAllUsers,
  updateProfile,
  changePassword,
  forgetPassword,
  resetPassword,
  contactUs,
  logout,
};
