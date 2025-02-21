const express = require("express");
const {
  handlesignUp,
  handleLogin,
  logout,
  handleGetUsers,
  handleGetUser,
  handleEditUser,
} = require("../Controller/User");
const authenticateToken = require("../middlewares/Auth");
const uploadMiddleware = require("../middlewares/Multer");

const router = express.Router();

router.post("/signup", handlesignUp);
router.post("/login", handleLogin);
router.post("/logout", logout);
router.get("/users", authenticateToken, handleGetUsers);
router.get("/", handleGetUser);
router.put("/edit", authenticateToken, uploadMiddleware, handleEditUser);
module.exports = router;
