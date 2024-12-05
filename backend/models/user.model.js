import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    dateBirth: {
      type: Date,
      required: true,
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    position_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "position",
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
      default: "",
    },
    user_password: {
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

const User = mongoose.model("User", usersSchema);

export default User;
