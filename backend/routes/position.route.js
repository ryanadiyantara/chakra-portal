import express from "express";
import {
  getPositions,
  createPositions,
  updatePositions,
  deletePositions,
} from "../controllers/position.controller.js";

const router = express.Router();

router.get("/", getPositions);
router.post("/", createPositions);
router.put("/:id", updatePositions);
router.delete("/:id", deletePositions);

export default router;
