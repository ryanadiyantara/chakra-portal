import express from "express";
import {
  getDepartments,
  createDepartments,
  updateDepartments,
  deleteDepartments,
} from "../controllers/department.controller.js";

const router = express.Router();

router.get("/", getDepartments);
router.post("/", createDepartments);
router.put("/:id", updateDepartments);
router.delete("/:id", deleteDepartments);

export default router;
