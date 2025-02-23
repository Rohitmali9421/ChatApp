require("dotenv").config();
const cors = require("cors");
const connectMongoDB = require("./config/connection");
const UserRouter = require("./Routes/User");
const MessageRouter = require("./Routes/Message");
const cookieParser = require("cookie-parser");
const { app, server } = require("./Socket/socket");
const express = require("express");
const port = process.env.PORT || 8000;
const URI = process.env.MONGODB_URI;
connectMongoDB(URI);


app.use(
  cors({
    origin: process.env.FRONTEND_API,
    credentials: true,
  })
);

//Midelewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/user", UserRouter);
app.use("/api/message", MessageRouter);

server.listen(port, () => {
  console.log("server Started");
});
