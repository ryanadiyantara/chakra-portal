import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    event_startDate: {
      type: Date,
      required: true,
    },
    event_endDate: {
      type: Date,
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

const Event = mongoose.model("Event", eventsSchema);

export default Event;
