const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_API],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

const userSocketMap = {}; 

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    socket.userId = userId; 

  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (socket.userId) {
      delete userSocketMap[socket.userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

module.exports = { app, io, server, getReceiverSocketId };
