import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    season: { type: String },
    group: { type: { label: String, id: String, selected: Boolean } },
    player1: { type: { label: String, id: String, selected: Boolean } },
    player1set1: { type: String },
    player1tiebreak1: { type: String },
    player1set2: { type: String },
    player1tiebreak2: { type: String },
    player1set3: { type: String },
    player2: { type: { label: String, id: String, selected: Boolean } },
    player2set1: { type: String },
    player2tiebreak1: { type: String },
    player2set2: { type: String },
    player2tiebreak2: { type: String },
    player2set3: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Match", MatchSchema);
