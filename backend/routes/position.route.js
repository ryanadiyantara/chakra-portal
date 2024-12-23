import express from "express";
import {
  getPositions,
  createPositions,
  updatePositions,
  deletePositions,
} from "../controllers/position.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// Verify JWT
router.use(verifyJWT);

// Routes
router.get("/", getPositions);
router.post("/", createPositions);
router.put("/:id", updatePositions);
router.delete("/:id", deletePositions);

export default router;
