import express, { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { verifyToken } from "../middleware/auth";
import { OAuth2Client } from "google-auth-library";
import validator from "validator";

import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    console.log("accessToken", accessToken);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token as string,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

interface AuthRequest extends Request {
  user?: { userId: string }; // Ensure user is optional to prevent runtime errors
}

// Register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, fullName, email, password, role } = req.body;
    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Invalid email address" });
      return;
    }
    if (!validator.isLength(password, { min: 6 })) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }
    const adminUser = await User.findOne({ role: "admin" });
    if (role === "admin" && adminUser) {
      res.status(400).json({ message: "An admin user already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err instanceof Error)
      res
        .status(500)
        .json({ message: `Internal Server Error: ${err.message}` });
  }
});

// Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Invalid email address" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return; // Ensure the function exits after sending response
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `Internal Server Error: ${err.message}` });
    }
  }
});

// Logout
router.post("/logout", (_req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

// Verify route that user is authentificated
router.get(
  "/me",
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.user?.userId).select("-password");
      res.json(user);
    } catch (err) {
      if (err instanceof Error)
        res
          .status(500)
          .json({ message: `Internal Server Error: ${err.message}` });
    }
  }
);

// Get all users
router.get("/users", async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    if (err instanceof Error)
      res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
});

// Forgot password
router.post(
  "/forgot-password",
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Invalid email address" });
      return;
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return; // Ensure function exits
      }
      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
      await user.save();
      // Send email with the reset link
      const resetLink = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
      await sendEmail(
        user.email,
        "Password Reset Request",
        `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
      );
      res.json({ message: "Reset link sent to email" }); // No need to return the response object
    } catch (err) {
      if (err instanceof Error)
        res.status(500).json({ message: `Server error ${err.message}` });
    }
  }
);

// Reset password
router.post(
  "/resetPassword/:token",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      if (!validator.isLength(newPassword, { min: 6 })) {
        res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
        return;
      }

      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }, // Ensure token is valid
      });

      if (!user) {
        res.status(400).json({ message: "Invalid or expired token" });
        return; // Ensure function exits
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      // Clear reset token fields
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      res.json({ message: "Password reset successful" });
    } catch (err) {
      if (err instanceof Error)
        res.status(500).json({ message: `Server error ${err.message}` });
    }
  }
);

router.post(
  "/deleteUser",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      // Validate input
      if (!validator.isEmail(email)) {
        res.status(400).json({ message: "Invalid email address" });
        return;
      }
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return; // Ensure function exits
      }
      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      if (err instanceof Error)
        res.status(500).json({ message: `Server error ${err.message}` });
    }
  }
);

export default router;
