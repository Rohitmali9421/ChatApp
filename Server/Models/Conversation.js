const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema(
  {
    participants:[ {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    }],

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);


module.exports =  Conversation ;
