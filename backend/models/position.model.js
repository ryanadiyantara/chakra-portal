import mongoose from "mongoose";

const positionsSchema = new mongoose.Schema(
  {
    position_name: {
      type: String,
      required: true,
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
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

const Position = mongoose.model("Position", positionsSchema);

export default Position;
