import mongoose from "mongoose";
import AttendanceRecord from "../models/attendance_record.model.js";

export const getAttendanceRecords = async (req, res) => {
  try {
    const attendanceRecords = await AttendanceRecord.find({});
    res.status(200).json({ success: true, data: attendanceRecords });
  } catch (error) {
    console.log("Error in Fetching attendance recordss:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const createAttendanceRecords = async (req, res) => {
  const attendanceRecords = req.body; // user will send this data

  if (
    !attendanceRecords.user_id ||
    !attendanceRecords.attendance_date ||
    !attendanceRecords.attendance_status ||
    !attendanceRecords.checkIn ||
    !attendanceRecords.checkOut
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const newAttendanceRecord = new AttendanceRecord(attendanceRecords);

  try {
    await newAttendanceRecord.save();
    res.status(201).json({ success: true, data: newAttendanceRecord });
  } catch (error) {
    console.error("Error in Create attendance records:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateAttendanceRecords = async (req, res) => {
  const { id } = req.params;

  const attendanceRecords = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Attendance Record Id" });
  }

  try {
    const updatedAttendanceRecord = await AttendanceRecord.findByIdAndUpdate(
      id,
      attendanceRecords,
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, data: updatedAttendanceRecord });
  } catch (error) {
    console.log("Error in Deleting attendance records:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteAttendanceRecords = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Attendance Record Id" });
  }

  try {
    await AttendanceRecord.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Attendance Record deleted" });
  } catch (error) {
    console.log("Error in Deleting attendance records:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
