import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Event from "../models/event.model.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "frontend/public/uploads/event");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("file");

export const createEvents = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const event = req.body; // user will send this data

    if (!event.event_name || !event.description || !event.event_startDate || !event.event_endDate) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = path.relative("frontend/public", req.file.path);
    event.poster_path = filePath;

    const newEvent = new Event(event);

    try {
      await newEvent.save();
      res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
      console.error("Error in Create event:", error, message);
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

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.log("Error in Fetching events:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const updateEvents = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const { id } = req.params;
    const event = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid Event Id" });
    }

    if (req.file) {
      const filePath = path.relative("frontend/public", req.file.path);

      event.poster_path = filePath;
    }

    try {
      const updatedEvent = await Event.findByIdAndUpdate(id, event, {
        new: true,
      });
      res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
      console.log("Error in Updating events:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

export const deleteEvents = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Event Id" });
  }

  try {
    await Event.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.log("Error in Deleting events:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
