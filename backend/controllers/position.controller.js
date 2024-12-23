import mongoose from "mongoose";
import Position from "../models/position.model.js";

// Controller to create a new position
export const createPositions = async (req, res) => {
  const position = req.body; // user will send this data

  // Validate required fields
  if (!position.position_name || !position.department_id) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    // Save new position to database
    const newPosition = new Position(position);
    await newPosition.save();

    res.status(201).json({ success: true, data: newPosition });
  } catch (error) {
    console.error("Error in Create position:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to get all positions
export const getPositions = async (req, res) => {
  try {
    // Fetch all positions and populate department details
    const positions = await Position.find({}).populate("department_id", "department_name");

    res.status(200).json({ success: true, data: positions });
  } catch (error) {
    console.log("Error in Fetching positions:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a position by ID
export const updatePositions = async (req, res) => {
  const { id } = req.params;
  const position = req.body; // user will send this data

  // Validate the position ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Position Id" });
  }

  try {
    // Update the position by ID
    const updatedPosition = await Position.findByIdAndUpdate(id, position, {
      new: true,
    });

    res.status(200).json({ success: true, data: updatedPosition });
  } catch (error) {
    console.log("Error in Updating positions:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to delete a position by ID
export const deletePositions = async (req, res) => {
  const { id } = req.params;

  // Validate the position ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Position Id" });
  }

  try {
    // Delete the position by ID
    await Position.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Position deleted" });
  } catch (error) {
    console.log("Error in Deleting positions:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
