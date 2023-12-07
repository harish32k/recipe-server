import model from "./model.js";

export const createRecipe = (recipe) => model.create({ ...recipe, postedTime: Date.now() });
export const findAllRecipes = () => model.find().populate("userId", "firstName lastName username");
export const findRecipeById = (_id) => model.findOne({ _id: _id }) //.populate("userId", "firstName lastName username");
export const findRecipesByName = (inputString) =>
  model.find({ strMeal: { $regex: new RegExp(inputString, 'i') } }).populate("userId", "firstName lastName username");
export const findRecipesByCategory = (category) => model.find({ strCategory: category }).populate("userId", "firstName lastName username");
export const findRecipesByArea = (area) => model.find({ strArea: area }).populate("userId", "firstName lastName username");
export const findRecipesByUserId = (userId) => model.find({ userId }).populate("userId", "firstName lastName username");
export const updateRecipe = (_id, recipe) =>
  model.updateOne({ _id: _id }, { $set: recipe });
export const deleteRecipe = (_id) => model.deleteOne({ _id: _id });
// export const findRecipesByIngredients = (ingredientList) =>
//   model.find({ ingredients: { $in: ingredientList } });
