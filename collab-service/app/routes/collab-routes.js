import express from "express";
import {
  createRoom,
  getRoomByUser,
  getAllRoomsController,
  getAllRoomsByUser,
  getRoomChatHistory,
  getQuestionId,
} from "../controller/collab-controller.js";

const router = express.Router();

router.post("/create-room", createRoom);

router.get("/user/:user", getRoomByUser);

router.get("/rooms", getAllRoomsController);

router.get("/rooms/:user", getAllRoomsByUser);

router.get("/chat-history/:roomId", getRoomChatHistory);

router.get("/rooms/:roomId/questionId", getQuestionId);

export default router;
