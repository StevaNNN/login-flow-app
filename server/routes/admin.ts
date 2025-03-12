import express, { Request, Response } from "express";
import User from "../models/User";
import validator from "validator";

export const adminRouter = express.Router();

// Get all users
adminRouter.get("/users", async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    if (err instanceof Error)
      res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
});

adminRouter.post(
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
