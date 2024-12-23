import mongoose from "mongoose";
import Department from "../models/department.model.js";

// Controller to create a new department
export const createDepartments = async (req, res) => {
  const department = req.body; // user will send this data

  // Validate required fields
  if (!department.department_name) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    // Save new department to database
    const newDepartment = new Department(department);
    await newDepartment.save();

    res.status(201).json({ success: true, data: newDepartment });
  } catch (error) {
    console.error("Error in Create department:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to get all departments
export const getDepartments = async (req, res) => {
  try {
    // Fetch all departments
    const departments = await Department.find({});

    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    console.log("Error in Fetching departments:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a department by ID
export const updateDepartments = async (req, res) => {
  const { id } = req.params;
  const department = req.body; // user will send this data

  // Validate the department ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Department Id" });
  }

  try {
    // Update the department by ID
    const updatedDepartment = await Department.findByIdAndUpdate(id, department, {
      new: true,
    });

    res.status(200).json({ success: true, data: updatedDepartment });
  } catch (error) {
    console.log("Error in Updating departments:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to delete a department by ID
export const deleteDepartments = async (req, res) => {
  const { id } = req.params;

  // Validate the department ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Department Id" });
  }

  try {
    // Delete the department by ID
    await Department.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    console.log("Error in Deleting departments:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
