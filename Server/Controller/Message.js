const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getReceiverSocketId, io } = require("../Socket/socket");
const genAI = new GoogleGenerativeAI("AIzaSyCtwC14g6HpuWQqjRtkj72RhOyD98QOXLk");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const handleSendMessage = async (req, res) => {
  const { recieverId } = req.params;
  const { message } = req.body;
  const senderId = req.user.id;
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [recieverId, senderId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [recieverId, senderId],
      });
    }
    const msg = await Message.create({
      senderId,
      recieverId,
      text: message,
    });
    if (msg) {
      conversation.messages.push(msg._id);
    }
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(recieverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", msg);
    }

    return res.status(200).json(msg);
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
const handlegetMessage = async (req, res) => {
  try {
    const { recieverId } = req.params;
    const senderId = req.user.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
const handleGemini = async (req, res) => {
    try {
      // Support both GET (query params) and POST (body)
      const question = req.method === "GET" ? req.query.question : req.body.question;
  
      if (!question) {
        return res.status(400).json({ error: "Question is required." });
      }
  
      const result = await model.generateContent(question);
      const aiResponse = result.response.text().split(".")[0] + "."; // Short response
  
      res.status(200).json({ response: aiResponse.trim() });
    } catch (error) {
      console.error("Error generating AI response:", error);
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  };
  

module.exports = {
  handleSendMessage,
  handlegetMessage,
  handleGemini,
};
