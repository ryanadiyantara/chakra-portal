import express from "express";
import {
  getDepartments,
  createDepartments,
  updateDepartments,
  deleteDepartments,
} from "../controllers/department.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// Verify JWT
router.use(verifyJWT);

// Routes
router.get("/", getDepartments);
router.post("/", createDepartments);
router.put("/:id", updateDepartments);
router.delete("/:id", deleteDepartments);

export default router;
