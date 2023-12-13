import mongoose from "mongoose";

const favCategoriesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userId is ObjectId
    ref: "users", // Reference to the User model
    required: true,
  },
  strCategory: {
    type: mongoose.Schema.Types.String, // Using Mixed type to allow both ObjectId and string
    required: true,
  },
  favouritedTime: Date,
});

// Ensuring a unique combination of userId and recipeId
favCategoriesSchema.index({ userId: 1, strCategory: 1 }, { unique: true });

export default favCategoriesSchema;
