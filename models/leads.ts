import mongoose, { Schema } from "mongoose";

const LeadsSchema = new Schema(
  {
    id: { type: String, default: new mongoose.Types.ObjectId(), unique: true },
    email: { type: String, unique: true },
  },
  { timestamps: true }
);

const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadsSchema);
export default Lead;
