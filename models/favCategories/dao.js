import model from "./model.js";

export const addFavouriteCategory = (userId, strCategory) =>
  model.create({ userId, strCategory, favouritedTime: Date.now() });
export const removeFavouriteCategory = (userId, strCategory) =>
  model.deleteOne({ userId: userId, strCategory: strCategory });
export const getCategoriesFavouritedByUser = (userId) => model.find({ userId });

// export const findRecipeById = (_id) => model.findOne({ _id: _id });
// export const findRecipesByName = (inputString) =>
//   model.find({ strMeal: { $regex: new RegExp(inputString, 'i') } });
// export const findRecipesByCategory = (category) => model.find({ strCategory: category });
// export const findRecipesByArea = (area) => model.find({ strArea: area });
// export const findRecipesByUserId = (userId) => model.find({ userId });
// export const updateRecipe = (_id, recipe) =>
//   model.updateOne({ _id: _id }, { $set: recipe });
// export const deleteRecipe = (_id) => model.deleteOne({ _id: _id });
// export const findRecipesByIngredients = (ingredientList) =>
//   model.find({ ingredients: { $in: ingredientList } });
