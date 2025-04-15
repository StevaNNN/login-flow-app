import express, { Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique filenames
import validator from "validator";
import User from "../models/User";
import { verifyToken } from "../middleware/auth";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: (_req, file) => ({
    folder: "player_images",
    format: file.mimetype.split("/")[1], // Extract format from mimetype
    public_id: uuidv4(), // Generate a unique filename
  }),
});

const upload = multer({ storage });

export const playerRouter = express.Router();

// Upload user profile picture
playerRouter.post(
  "/uploadPicture",
  verifyToken,
  upload.single("image"),
  (req, res, next) => {
    (async () => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const imageUrl = req.file.path; // Cloudinary returns the URL

        // 🔹 Save imageUrl to your database if needed

        res.json({ imageUrl });
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    })().catch(next);
  }
);

// Upate user info
playerRouter.post(
  "/updateUserInfo",
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, userName, fullName, photo, _id } = req.body;
      // Validate input
      if (!validator.isEmail(email)) {
        res.status(400).json({ message: "Invalid email address" });
        return;
      }
      const user = await User.findOne({ _id });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      user.photo = photo;
      user.userName = userName;
      user.fullName = fullName;
      user.email = email;
      await user.save();
      res.json({ message: "User infos updated successfully" });
    } catch (err) {
      if (err instanceof Error)
        res.status(500).json({ message: `Server error ${err.message}` });
    }
  }
);
