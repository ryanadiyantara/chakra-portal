import mongoose from "mongoose";
import Position from "../models/position.model.js";

export const getPositions = async (req, res) => {
  try {
    const positions = await Position.find({});
    res.status(200).json({ success: true, data: positions });
  } catch (error) {
    console.log("Error in Fetching positions:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const createPositions = async (req, res) => {
  const position = req.body; // user will send this data

  if (!position.position_name || !position.department_id) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const newPosition = new Position(position);

  try {
    await newPosition.save();
    res.status(201).json({ success: true, data: newPosition });
  } catch (error) {
    console.error("Error in Create position:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updatePositions = async (req, res) => {
  const { id } = req.params;

  const position = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Position Id" });
  }

  try {
    const updatedPosition = await Position.findByIdAndUpdate(id, position, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedPosition });
  } catch (error) {
    console.log("Error in Deleting positions:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deletePositions = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Position Id" });
  }

  try {
    await Position.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Position deleted" });
  } catch (error) {
    console.log("Error in Deleting positions:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
