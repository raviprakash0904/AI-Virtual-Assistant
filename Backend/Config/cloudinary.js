import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// ⚡ .env load karo (agar upar server.js me bhi call kiya hai to bhi safe hai)
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Debug check karo values aa rahi hain ya nahi
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "LOADED" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING",
});

const uploadOnCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "assistants"  // optional folder
    });
    fs.unlinkSync(filePath); // local file delete kar do
    return result.secure_url; // ✅ ye url DB me save hoga
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
