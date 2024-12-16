import express from "express";
import {
  getUsers,
  getCurrentUsers,
  createUsers,
  updateUsers,
  deleteUsers,
} from "../controllers/user.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getUsers);
router.get("/:id", getCurrentUsers);
router.post("/", createUsers);
router.put("/:id", updateUsers);
router.delete("/:id", deleteUsers);

export default router;
