import { connectToMongo } from "./model/repository.js";
import http from "http";
import index from "./index.js";
import { Server } from "socket.io";
import { addMessageToChat } from "./model/repository.js";
import ywsUtils from "y-websocket/bin/utils";
import { WebSocketServer } from "ws";
const setupWSConnection = ywsUtils.setupWSConnection;

const PORT = process.env.PORT || 3002;
const server = http.createServer(index);
const docs = ywsUtils.docs;

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins; replace with specific origin if needed
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const yjsWs = new WebSocketServer({ noServer: true });
yjsWs.on("connection", (conn, req) => {
  setupWSConnection(conn, req, {
    gc: req.url.slice(1) !== "ws/prosemirror-versions",
  });
});

setInterval(() => {
  let conns = 0;
  docs.forEach((doc) => {
    conns += doc.conns.size;
  });
  const stats = {
    conns,
    docs: docs.size,
    websocket: `ws://localhost:${PORT}`,
    http: `http://localhost:${PORT}`,
  };
  console.log(`${new Date().toISOString()} Stats: ${JSON.stringify(stats)}`);
}, 10000);

io.on("connection", (socket) => {
  console.log("User connected to Socket.IO");

  // Join a room based on roomId
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle incoming chat messages
  socket.on("sendMessage", async (data) => {
    const { roomId, userId, text } = data;
    const newMessage = await addMessageToChat(roomId, userId, text);

    // Broadcast the message to all clients in the same room
    io.to(roomId).emit("chatMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from Socket.IO");
  });
});

server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;

  if (pathname.startsWith("/yjs")) {
    yjsWs.handleUpgrade(request, socket, head, (ws) => {
      yjsWs.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

connectToMongo()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
