import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import User from "../models/user.model.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "frontend/public/uploads/userProfilePicture");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("file");

export const createUsers = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const user = req.body; // user will send this data

    if (
      !user.user_name ||
      !user.email ||
      !user.dateBirth ||
      !user.department_id ||
      !user.position_id ||
      !user.startDate
    ) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = path.relative("frontend/public", req.file.path);

    user.profilePicture = filePath;

    const newUser = new User(user);

    try {
      await newUser.save();
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      console.error("Error in Create user:", error, message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log("Error in Fetching users:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const updateUsers = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const { id } = req.params;
    const user = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    if (req.file) {
      const filePath = path.relative("frontend/public", req.file.path);

      user.profilePicture = filePath;
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(id, user, {
        new: true,
      });
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.log("Error in Updating users:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

export const deleteUsers = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User Id" });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log("Error in Deleting users:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
