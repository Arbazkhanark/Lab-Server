
const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueType: { type: String, required: true, enum: ['Technical Issue', 'Non-Technical Issue'] },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  equipment: { type: String, required: true },
  hardwareIssueDetails: { type: String }, // Add hardwareIssueDetails field
  softwareIssueDetails: { type: String }, // Add softwareIssueDetails field
  images: [String],
  status: { type: String, enum: ['Pending', 'Assigned', 'Resolved'], default: 'Pending' },
  details: { type: String, required: true },
  urgencyLevel: { type: String, enum: ['Low', 'Medium', 'High'] }, // Add urgencyLevel field
  timestamp: { type: Date, default: Date.now },
});

const complainModel = mongoose.model("Complaint", complainSchema);
module.exports = complainModel;
