import mongoose from "mongoose";
import Event from "../models/event.model.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.log("Error in Fetching events:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const createEvents = async (req, res) => {
  const event = req.body; // user will send this data

  if (
    !event.event_name ||
    !event.poster ||
    !event.description ||
    !event.event_startDate ||
    !event.event_endDate
  ) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const newEvent = new Event(event);

  try {
    await newEvent.save();
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.error("Error in Create event:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateEvents = async (req, res) => {
  const { id } = req.params;

  const event = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Event Id" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, event, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.log("Error in Deleting events:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
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
