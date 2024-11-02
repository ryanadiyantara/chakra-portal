import mongoose from "mongoose";

const attendanceRecordsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    attendance_date: {
      type: Date,
      required: true,
    },
    attendance_status: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
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

const AttendanceRecord = mongoose.model(
  "AttendanceRecord",
  attendanceRecordsSchema
);

export default AttendanceRecord;
