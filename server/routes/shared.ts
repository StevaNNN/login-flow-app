import express, { Request, Response } from "express";
import Match from "../models/Match";
import Season from "../models/Season";
import User from "../models/User";

export const sharedRouter = express.Router();
// Add match
sharedRouter.post(
  "/addMatch",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        season,
        group,
        player1,
        player1setsWon,
        player1set1,
        player1tiebreak1,
        player1set2,
        player1tiebreak2,
        player1set3,
        player2,
        player2setsWon,
        player2set1,
        player2tiebreak1,
        player2set2,
        player2tiebreak2,
        player2set3,
      } = req.body;

      const newMatch = new Match({
        season,
        group,
        player1,
        player1setsWon,
        player1set1,
        player1tiebreak1,
        player1set2,
        player1tiebreak2,
        player1set3,
        player2,
        player2setsWon,
        player2set1,
        player2tiebreak1,
        player2set2,
        player2tiebreak2,
        player2set3,
      });
      await newMatch.save();
      res.status(201).json({ message: "Match scores saved successfully" });
    } catch (err) {
      if (err instanceof Error)
        res.status(500).json({ message: `Server error ${err.message}` });
    }
  }
);

// Get all seasons
sharedRouter.get(
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

// Get all users
sharedRouter.get(
  "/matches",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const matches = await Match.find();
      res.json(matches);
    } catch (err) {
      if (err instanceof Error)
        res
          .status(500)
          .json({ error: `Internal Server Error: ${err.message}` });
    }
  }
);

// Get all users
sharedRouter.get(
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
