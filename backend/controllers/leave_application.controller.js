import mongoose from "mongoose";
import LeaveApplication from "../models/leave_application.model.js";

export const getLeaveApplications = async (req, res) => {
  try {
    const leaveApplications = await LeaveApplication.find({});
    res.status(200).json({ success: true, data: leaveApplications });
  } catch (error) {
    console.log("Error in Fetching leave applications:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const createLeaveApplications = async (req, res) => {
  const leaveApplications = req.body; // user will send this data

  if (
    !leaveApplications.user_id ||
    !leaveApplications.leave_startDate ||
    !leaveApplications.leave_endDate ||
    !leaveApplications.type ||
    !leaveApplications.leave_status
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const newLeaveApplication = new LeaveApplication(leaveApplications);

  try {
    await newLeaveApplication.save();
    res.status(201).json({ success: true, data: newLeaveApplication });
  } catch (error) {
    console.error("Error in Create leave application:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateLeaveApplications = async (req, res) => {
  const { id } = req.params;

  const leaveApplications = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Leave Application Id" });
  }

  try {
    const updatedLeaveApplication = await LeaveApplication.findByIdAndUpdate(
      id,
      leaveApplications,
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, data: updatedLeaveApplication });
  } catch (error) {
    console.log("Error in Deleting leave applications:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteLeaveApplications = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Leave Application Id" });
  }

  try {
    await LeaveApplication.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Leave Application deleted" });
  } catch (error) {
    console.log("Error in Deleting leave applications:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
