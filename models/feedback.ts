import mongoose, { Schema } from "mongoose";

const FeedbackSchema = new Schema(
  {
    id: { type: String, default: new mongoose.Types.ObjectId() },
    userId: { type: String, uniqued: true },
    avatar: { type: String },
    star: { type: Number, default: 0 },
    comment: { type: String },
    nextShow: { type: String },
  },
  { timestamps: true }
);

const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
