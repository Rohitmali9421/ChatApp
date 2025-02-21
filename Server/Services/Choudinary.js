const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadOnCloudinary(localFilePath) {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "Chat_App"
    });
    fs.unlinkSync(localFilePath);
    return {
      public_id: response.public_id,
      url: response.url,
    };
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
}
async function deleteOnCloudinary(public_id) {
  try {
    const response = await cloudinary.api.delete_resources([public_id]);
    // console.log(response);
  } catch (error) {
    console.log("Error deleting resource:", error);
  }
}


module.exports = {
  uploadOnCloudinary,
  deleteOnCloudinary
};
