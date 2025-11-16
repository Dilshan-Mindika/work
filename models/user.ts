import { Credits } from "@/lib/config/pricing";
import mongoose, { Schema } from "mongoose";

// Define the User schema
const UserSchema = new Schema(
  {
    // Unique identifier for the user
    id: { type: String, default: new mongoose.Types.ObjectId(), unique: true },
    emailAddress: [{ type: String }],
    firstName: { type: String },
    lastName: { type: String },
    picture: { type: String },
    stripeCustomerId: { type: String },
    lemonsqueezyCustomerId: { type: String },
    webxpayCustomerId: { type: String },
    credits: { type: Number, default: Credits.freeCredits },

    plan: {
      id: { type: String },
      type: { type: String, default: "free" },
      name: { type: String },
      price: { type: String },
      isPremium: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema); // Check if User model already exists
export default User;
