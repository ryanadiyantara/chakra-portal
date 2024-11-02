import express from "express";
import {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
} from "../controllers/event.controller.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvents);
router.put("/:id", updateEvents);
router.delete("/:id", deleteEvents);

export default router;
