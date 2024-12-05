import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seq: { type: Number, required: true },
});

const Counter = mongoose.model("Counteruser", counterSchema);

export default Counter;
