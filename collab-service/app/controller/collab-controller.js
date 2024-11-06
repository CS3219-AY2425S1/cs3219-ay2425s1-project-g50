import {
  newRoom,
  getRoomId,
  getAllRooms,
  fetchRoomChatHistory,
  getQuestionIdByRoomId,
  getAllRoomsByUserId,
} from "../model/repository.js";
import crypto from "crypto";

// Create a room between two users
export async function createRoom(req, res) {
  const { user1, user2, question_id } = req.body;

  if (!user1 || !user2 || !question_id) {
    return res
      .status(400)
      .json({ error: "user1,user2 and question_id are required" });
  }

  // Generate a unique room ID by hashing the two user IDs
  const timeSalt = new Date().toISOString().slice(0, 19);
  const roomId = crypto
    .createHash("sha256")
    .update(user1 + user2 + timeSalt)
    .digest("hex");
  const room = await newRoom(user1, user2, roomId, question_id);

  if (room) {
    res.status(201).json(room);
  } else {
    res.status(500).json({ error: "Failed to create room" });
  }
}

// Get room ID by user
export async function getRoomByUser(req, res) {
  const { user } = req.params;

  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  const room = await getRoomId(user);

  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).json({ error: `Room not found for user: ${user}` });
  }
}

// Get all rooms
export async function getAllRoomsController(req, res) {
  const rooms = await getAllRooms();

  if (rooms) {
    res.status(200).json(rooms);
  } else {
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
}

// Get all rooms by user
export async function getAllRoomsByUser(req, res) {
  const { user } = req.params;
  const rooms = await getAllRoomsByUserId(user);

  if (rooms) {
    res.status(200).json(rooms);
  } else {
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
}
export async function getRoomChatHistory(req, res) {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required" });
  }

  const room = await fetchRoomChatHistory(roomId);

  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).json({ error: `Room not found for ID: ${roomId}` });
  }
}

// Get QuestionId from the room based on the roomId
export async function getQuestionId(req, res) {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required" });
  }
  const questionId = await getQuestionIdByRoomId(roomId);

  if (questionId) {
    res.status(200).json({ questionId });
  } else {
    res
      .status(404)
      .json({ error: `Question ID not found for room ID: ${roomId}` });
  }
}
