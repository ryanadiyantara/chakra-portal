import express from "express";
import dotenv from "dotenv";
// import path from "path";

import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js";
import leaveApplicationRoutes from "./routes/leave_application.route.js";
import attendanceRecordRoutes from "./routes/attendance_record.route.js";
import eventRoutes from "./routes/event.route.js";
import departmentRoutes from "./routes/department.route.js";
import positionRoutes from "./routes/position.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

app.use(express.json()); //allows us to accept JSON data in the req.body

app.use("/api/users", userRoutes);
app.use("/api/leaveapplications", leaveApplicationRoutes);
app.use("/api/attendancerecords", attendanceRecordRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/positions", positionRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
