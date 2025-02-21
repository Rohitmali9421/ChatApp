const mongoose = require("mongoose");
const MessageSchema = mongoose.Schema(
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",
      },
      recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",
      },
      text: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  );
  const Message = mongoose.model("Message", MessageSchema);
  module.exports =  Message ;