import express from "express";
import {
  getAttendanceRecords,
  createAttendanceRecords,
  updateAttendanceRecords,
  deleteAttendanceRecords,
} from "../controllers/attendance_record.controller.js";

const router = express.Router();

router.get("/", getAttendanceRecords);
router.post("/", createAttendanceRecords);
router.put("/:id", updateAttendanceRecords);
router.delete("/:id", deleteAttendanceRecords);

export default router;
