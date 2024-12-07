import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import LeaveApp from "../models/leave_app.model.js";
import Counter from "../models/counter.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "frontend/public/uploads/leaveAppFile");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("file");

const getNextLeaveAppId = async (userId) => {
  const prefix = "LEAVE";
  const year = new Date().getFullYear();
  const counterName = `${prefix}/${userId}/${year}`;

  try {
    let counter = await Counter.findOne({ name: counterName });

    if (!counter) {
      return { id: `${prefix}/${userId}/${year}/1`, seq: 1, name: counterName, isNew: true };
    } else {
      return {
        id: `${prefix}/${userId}/${year}/${counter.seq + 1}`,
        seq: counter.seq + 1,
        name: counterName,
        isNew: false,
      };
    }
  } catch (error) {
    console.error("Error in getNextLeaveAppId:", error.message);
    throw new Error("Failed to generate LeaveApp ID");
  }
};

export const createLeaveApps = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }
    const leaveApp = req.body; // user will send this data

    if (!leaveApp.type || !leaveApp.leave_startDate || !leaveApp.leave_endDate) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    if (req.file) {
      const filePath = path.relative("frontend/public", req.file.path);
      leaveApp.attachment = filePath;
    }

    try {
      const { id, seq, name, isNew } = await getNextLeaveAppId(leaveApp.currentId);
      leaveApp.leaveAppId = id;
      leaveApp.leave_status = "Pending";
      delete leaveApp.currentId;

      const newLeaveApp = new LeaveApp(leaveApp);
      await newLeaveApp.save();

      if (isNew) {
        const newCounter = new Counter({ name, seq });
        await newCounter.save();
      } else {
        await Counter.updateOne({ name }, { $inc: { seq: 1 } });
      }

      res.status(201).json({ success: true, data: newLeaveApp });
    } catch (error) {
      console.error("Error in Create leave application:", error, message);
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete file during error handling:", unlinkErr);
          }
        });
      }
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
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