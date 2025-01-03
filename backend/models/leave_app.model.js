import mongoose from "mongoose";

const leaveAppsSchema = new mongoose.Schema(
  {
    leaveAppId: {
      type: String,
      required: true,
    },
    leave_startDate: {
      type: Date,
      required: true,
    },
    leave_endDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
      required: false,
      default: "-",
    },
    leave_status: {
      type: String,
      required: true,
    },
    na: {
      type: Boolean,
      required: false,
      default: false,
    },
    del: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const LeaveApp = mongoose.model("LeaveApp", leaveAppsSchema);

export default LeaveApp;
