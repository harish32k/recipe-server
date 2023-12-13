import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    strMeal: String,
    strCategory: String,
    strArea: String,
    strYoutube: String,
    strInstructions: String,
    strMealThumb: String,
    measures: [String], // Array of strings for measures
    ingredients: [String], // Array of strings for ingredients
    source: {
      type: String,
      enum: ["origin", "external"],
      default: "origin",
    }, // origin and external
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming userId is ObjectId
      ref: "users", // Reference to the User model
      required: true,
    },
    postedTime: Date,
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "recipes" }
);

//const recipe = mongoose.model('recipes', recipeSchema);

export default recipeSchema;
