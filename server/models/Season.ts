import { model, Schema } from "mongoose";

// PARTICIPANT Type
const ParticipantSchema = new Schema({
  label: { type: String, required: true },
  id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  selected: { type: Boolean, default: false },
});

// GROUP Type Schema
const GroupSchema = new Schema({
  group: {
    label: { type: String, required: true },
    id: { type: String, required: true },
    selected: { type: Boolean, default: false },
  },
  participants: [
    {
      label: { type: String, required: true },
      id: { type: String, required: true },
      selected: { type: Boolean, default: false },
    },
  ],
});

// SEASON Schema
const SeasonSchema = new Schema(
  {
    seasonId: { type: String, required: true },
    seasonName: { type: String, required: true },
    seasonParticipants: [ParticipantSchema],
    seasonGroups: [GroupSchema],
  },
  { timestamps: true }
);

// Create and export the model
export default model("Season", SeasonSchema);
