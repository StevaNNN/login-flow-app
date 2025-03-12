import mongoose from "mongoose";

const SeasonSchema = new mongoose.Schema(
  {
    seasonName: { type: String, unique: true, required: true },
    seasonParticipants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    seasonGroups: [
      {
        groupName: { type: String, required: true },
        groupParticipants: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Season", SeasonSchema);
