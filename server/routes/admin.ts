import express, { Request, Response } from "express";
import User from "../models/User";
import validator from "validator";
import Season from "../models/Season";

export const adminRouter = express.Router();

// Get all users
adminRouter.get(
  "/users",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      if (err instanceof Error)
        res
          .status(500)
          .json({ error: `Internal Server Error: ${err.message}` });
    }
  }
);

// Delete user
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

// Get all seasons
adminRouter.get(
  "/seasons",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const seasons = await Season.find();
      res.json(seasons);
    } catch (err) {
      if (err instanceof Error)
        res
          .status(500)
          .json({ error: `Internal Server Error: ${err.message}` });
    }
  }
);

// Add new season
adminRouter.post(
  "/addSeason",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { seasonId, seasonName, seasonParticipants, seasonGroups } =
        req.body;
      const existingSeason = await Season.findOne({ seasonId });
      if (existingSeason) {
        res.status(400).json({ message: "Season already in exists" });
        return;
      }
      const newSeason = new Season({
        seasonId,
        seasonName,
        seasonParticipants,
        seasonGroups,
      });
      await newSeason.save();
      res.status(201).json({ message: "Season created successfully" });
    } catch (err) {
      if (err instanceof Error)
        res
          .status(500)
          .json({ message: `Internal Server Error: ${err.message}` });
    }
  }
);

// Edit season
adminRouter.put(
  "/editSeason",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { seasonId, seasonName, seasonParticipants, seasonGroups } =
        req.body;

      if (!seasonId || !seasonName || !seasonParticipants || !seasonGroups) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const existingSeason = await Season.findOne({ seasonId });
      if (!existingSeason) {
        res.status(404).json({ message: "Season not found" });
        return;
      }

      existingSeason.seasonName = seasonName;
      existingSeason.seasonParticipants = seasonParticipants;
      existingSeason.seasonGroups = seasonGroups;

      await existingSeason.save();

      res.status(200).json({ message: "Season updated successfully" });
    } catch (err) {
      console.error("Error updating season:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Delete season
adminRouter.delete(
  "/deleteSeason",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { seasonId } = req.query;

      if (!seasonId) {
        res.status(400).json({ message: "Missing seasonId" });
        return;
      }

      const existingSeason = await Season.findOne({ seasonId });
      if (!existingSeason) {
        res.status(404).json({ message: "Season not found" });
        return;
      }

      await existingSeason.deleteOne();

      res.status(200).json({ message: "Season deleted successfully" });
    } catch (err) {
      console.error("Error deleting season:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
