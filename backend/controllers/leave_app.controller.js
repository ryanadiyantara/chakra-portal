import mongoose from "mongoose";
import LeaveApp from "../models/leave_app.model.js";

export const createLeaveApps = async (req, res) => {
  const leaveApps = req.body; // user will send this data

  if (
    !leaveApps.user_id ||
    !leaveApps.leave_startDate ||
    !leaveApps.leave_endDate ||
    !leaveApps.type ||
    !leaveApps.leave_status
  ) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const newLeaveApp = new LeaveApp(leaveApps);

  try {
    await newLeaveApp.save();
    res.status(201).json({ success: true, data: newLeaveApp });
  } catch (error) {
    console.error("Error in Create leave application:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getLeaveApps = async (req, res) => {
  try {
    const leaveApps = await LeaveApp.find({});
    res.status(200).json({ success: true, data: leaveApps });
  } catch (error) {
    console.log("Error in Fetching leave applications:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const updateLeaveApps = async (req, res) => {
  const { id } = req.params;

  const leaveApps = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Leave Application Id" });
  }

  try {
    const updatedLeaveApp = await LeaveApp.findByIdAndUpdate(id, leaveApps, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedLeaveApp });
  } catch (error) {
    console.log("Error in Updating leave applications:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteLeaveApps = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Leave Application Id" });
  }

  try {
    await LeaveApp.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Leave Application deleted" });
  } catch (error) {
    console.log("Error in Deleting leave applications:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
