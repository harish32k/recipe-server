import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userId is ObjectId
    ref: "users", // Reference to the User model
    required: true,
  },
  recipeId: {
    type: mongoose.Schema.Types.Mixed, // Using Mixed type to allow both ObjectId and string
    required: true,
  },
  strComment: {
    type: mongoose.Schema.Types.String, // Using Mixed type to allow both ObjectId and string
    required: true,
  },
  commentedTime: Date,
});

export default commentSchema;
