import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userId is ObjectId
    ref: 'users', // Reference to the User model
    required: true
  },
  recipeId: {
    type: String, // Using Mixed type to allow both ObjectId and string
    required: true
  },
  likedTime: Date
});

// Ensuring a unique combination of userId and recipeId
likeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export default likeSchema;
