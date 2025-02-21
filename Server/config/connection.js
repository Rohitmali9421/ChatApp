const mongoose=require("mongoose")

function connectMongoDB(URI) {
    mongoose
      .connect(URI)
      .then(() => {
        console.log("connected");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  module.exports=connectMongoDB