import express from "express";
import {
  getLeaveApps,
  createLeaveApps,
  updateLeaveApps,
  deleteLeaveApps,
} from "../controllers/leave_app.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getLeaveApps);
router.post("/", createLeaveApps);
router.put("/:id", updateLeaveApps);
router.delete("/:id", deleteLeaveApps);

export default router;
