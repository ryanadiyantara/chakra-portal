import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";
import User from "../models/user.model.js";
import Counter from "../models/counter.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/userProfilePicture");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("file");

const getNextUserId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "user_id" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

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

    const existingEmail = await User.findOne({ email: user.email });
    if (existingEmail) {
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete file:", unlinkErr);
          }
        });
      }
      return res.status(400).json({ success: false, message: "Email is already taken" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = path.relative("public/uploads", req.file.path);
    user.profilePicture = filePath;

    try {
      user.user_id = await getNextUserId();
      const hashedPwd = await bcrypt.hash("chakra1234", 10); // salt rounds
      user.user_password = hashedPwd;

      const newUser = new User(user);
      await newUser.save();
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      console.error("Error in Create user:", error, message);
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

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate("department_id", "department_name")
      .populate("position_id", "position_name");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log("Error in Fetching users:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const getCurrentUsers = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  try {
    const user = await User.findById(id)
      .populate("department_id", "department_name")
      .populate("position_id", "position_name");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
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

    // Check ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    // Check New File
    if (req.file) {
      const filePath = path.relative("public/uploads", req.file.path);
      user.profilePicture = filePath;
    }

    // Check New Password
    if (user.old_password && user.new_password) {
      const foundUser = await User.findOne({ email: user.currentEmail }).exec();

      if (!foundUser) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      }

      const match = await bcrypt.compare(user.old_password, foundUser.user_password);

      if (!match) {
        return res.status(404).json({ success: false, message: "Wrong Old Password" });
      } else {
        delete user.old_password;
        delete user.currentEmail;
        const hashedPwd = await bcrypt.hash(user.new_password, 10); // salt rounds
        user.user_password = hashedPwd;
        delete user.new_password;
      }
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
