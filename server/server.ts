import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import { adminRouter } from "./routes/admin";
import { playerRouter } from "./routes/player";
import { sharedRouter } from "./routes/shared";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/player", playerRouter);
app.use("/api", sharedRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
