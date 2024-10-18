import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PasswordResetSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: false,
  },
  token: {
    type: String,
    required: true,
  },
  expireTime: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("PasswordResetModel", PasswordResetSchema);
