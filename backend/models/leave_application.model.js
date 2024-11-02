import mongoose from "mongoose";

const leaveApplicationsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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
    timestamps: true, //createdAt. updatedAt
  }
);

const LeaveApplication = mongoose.model(
  "LeaveApplication",
  leaveApplicationsSchema
);

export default LeaveApplication;
