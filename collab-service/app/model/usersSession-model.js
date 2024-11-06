import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  messageIndex: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
});

const usersSessionSchema = new Schema({
  users: {
    type: [String],
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  questionId: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  chatHistory: {
    type: [messageSchema],
    default: [],
  },
});

export default mongoose.model("UsersSession", usersSessionSchema);
