import express from "express";
import {
  getLeaveApplications,
  createLeaveApplications,
  updateLeaveApplications,
  deleteLeaveApplications,
} from "../controllers/leave_application.controller.js";
// import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// router.use(verifyJWT);

router.get("/", getLeaveApplications);
router.post("/", createLeaveApplications);
router.put("/:id", updateLeaveApplications);
router.delete("/:id", deleteLeaveApplications);

export default router;
