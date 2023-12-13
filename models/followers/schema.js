import mongoose from "mongoose";

const followersSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userId is ObjectId
    ref: "users", // Reference to the User model
    required: true,
  },
  followId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userId is ObjectId
    ref: "users", // Reference to the User model
    required: true,
  },
  followedTime: Date,
});

// Ensuring a unique combination of userId and recipeId
followersSchema.index({ userId: 1, followId: 1 }, { unique: true });

export default followersSchema;
