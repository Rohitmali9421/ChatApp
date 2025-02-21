const express=require("express");
const { handleSendMessage, handlegetMessage } = require("../Controller/Message");
const authenticateToken = require("../middlewares/Auth");
const router=express.Router();

router.post("/send/:recieverId",authenticateToken,handleSendMessage)
router.get("/get/:recieverId",authenticateToken,handlegetMessage)
module.exports=router