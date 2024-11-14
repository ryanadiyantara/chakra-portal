import express from "express";
import { uploadFile } from "../controllers/file_upload.controller.js";

const router = express.Router();

router.post("/", uploadFile);

export default router;
