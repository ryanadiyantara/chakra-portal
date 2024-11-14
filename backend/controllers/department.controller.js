import mongoose from "mongoose";
import Department from "../models/department.model.js";

export const createDepartments = async (req, res) => {
  const department = req.body; // user will send this data

  if (!department.department_name) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const newDepartment = new Department(department);

  try {
    await newDepartment.save();
    res.status(201).json({ success: true, data: newDepartment });
  } catch (error) {
    console.error("Error in Create department:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    console.log("Error in Fetching departments:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const updateDepartments = async (req, res) => {
  const { id } = req.params;

  const department = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Department Id" });
  }

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(id, department, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedDepartment });
  } catch (error) {
    console.log("Error in Deleting departments:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteDepartments = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Department Id" });
  }

  try {
    await Department.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    console.log("Error in Deleting departments:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
