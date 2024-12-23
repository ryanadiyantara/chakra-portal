import mongoose from "mongoose";

const departmentsSchema = new mongoose.Schema(
  {
    department_name: {
      type: String,
      required: true,
    },
    na: {
      type: Boolean,
      required: false,
      default: false,
    },
    del: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Department = mongoose.model("Department", departmentsSchema);

export default Department;
