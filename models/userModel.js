const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    // match: [/^[A-Za-z]+$/, "Name accepts alphabets only"],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'], // This restricts the values to these three options
    // You can remove this if you want to allow any string for gender
  },
  
  department: {
    type: String,
    required: [true, "Department is required."],
  },
  email: {
    type: String,
    required: [true, "Email address is required."],
    unique: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [8, "Password must be at least 8 characters long."],
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required."],
    validate: {
      validator: function (v) {
        return this.password === v;
      },
      message: "Passwords do not match.",
    },
  },
  contact: {
    type: String,
    // required: [true, "Contact number is required."],
    validate: {
      validator: function (v) {
        // Allow phone numbers with or without the leading +
        // and enforce the country code to be +91
        return /^\+91\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid contact number.`,
    },
  },
  urn:{
    type:String,
    required:true
  },
  adminAllowed:{
    type:Boolean,
    enum: [true, false],
    default:false
  },
  complains:[{
    email:String,
    labName:String,
    item:String,
    complaintDetails:String,
    time:Date
  }],
  avatar:{
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
  },
  otp: {
    type: Number, // Assuming OTP is a number
    // You may want to customize this based on your specific OTP implementation
  },
  otpExpire: {
    type: Date,
    default: () => new Date(+new Date() + 5 * 60 * 1000), // Set the default expiry to 5 minutes from now
  },

  verified: {
    type: Boolean,
    default: false, // Set to false by default, indicating the user is not verified
  },
  token:String,
  resetPasswordToken:String,
  resetPasswordExpire:Date
});

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;