import UserModel from "./user-model.js";
import PasswordResetModel from "./password-reset-model.js";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
  let mongoDBUri =
    process.env.ENV === "PROD"
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await connect(mongoDBUri);
}

export async function createUser(username, email, password) {
  return new UserModel({ username, email, password }).save();
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ email });
}

export async function findUserById(userId) {
  return UserModel.findById(userId);
}

export async function findUserByUsername(username) {
  return UserModel.findOne({ username });
}

export async function findUserByUsernameOrEmail(username, email) {
  return UserModel.findOne({
    $or: [{ username }, { email }],
  });
}

export async function findAllUsers() {
  return UserModel.find();
}

export async function updateUserById(
  userId,
  username,
  email,
  password,
  skillLevel
) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        username,
        email,
        password,
        skillLevel,
      },
    },
    { new: true } // return the updated user
  );
}

export async function updateUserPrivilegeById(userId, isAdmin) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isAdmin,
      },
    },
    { new: true } // return the updated user
  );
}

export async function deleteUserById(userId) {
  return UserModel.findByIdAndDelete(userId);
}

export async function createPasswordReset(email, token, expireTime) {
  return new PasswordResetModel({
    email,
    token,
    expireTime,
  }).save();
}

export async function findValidPasswordResetByToken(token) {
  return PasswordResetModel.findOne({
    token,
    expireTime: { $gt: Date.now() }, // Ensure token is not expired
  });
}
export async function deletePasswordResetByEmail(id) {
  return PasswordResetModel.findByIdAndDelete(id);
}
