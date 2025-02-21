const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const { getReceiverSocketId, io } = require("../Socket/socket");


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
    const { recieverId} = req.params;
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

module.exports = {
  handleSendMessage,
  handlegetMessage,
};
