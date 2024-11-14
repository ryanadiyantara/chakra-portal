import multer from "multer";
import Upload from "../models/uploads.model.js";

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "frontend/public/uploads/event"); // Folder untuk menyimpan file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Nama file unik
  },
});

// Inisialisasi multer
const upload = multer({ storage }).single("file");

// Controller untuk mengupload file
export const uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    // Cek apakah file berhasil diupload
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path; // Mendapatkan path dari file yang diupload

    try {
      // Simpan path file ke database menggunakan model Upload
      const newUpload = new Upload({ upload_path: filePath });
      await newUpload.save();

      res.status(201).json({ success: true, data: newUpload });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error saving file path to database",
        error: error.message,
      });
    }
  });
};
