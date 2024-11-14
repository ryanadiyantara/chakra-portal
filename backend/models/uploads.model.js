import mongoose from "mongoose";

const uploadsSchema = new mongoose.Schema(
  {
    upload_path: {
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
    timestamps: true, //createdAt. updatedAt
  }
);

const Upload = mongoose.model("Upload", uploadsSchema);

export default Upload;
