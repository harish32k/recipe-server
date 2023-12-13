import model from "./model.js";

export const addLike = (recipeId, userId) =>
  model.create({ recipeId, userId, likedTime: Date.now() });
export const removeLike = (recipeId, userId) =>
  model.deleteOne({ recipeId: recipeId, userId: userId });
export const getLikeCount = (recipeId) => model.countDocuments({ recipeId });
export const getLikedUsers = (recipeId) =>
  model.find({ recipeId }).populate("userId", "firstName lastName username");
export const isPostLikedByCurrentUser = (recipeId, userId) =>
  model.countDocuments({ recipeId, userId });
export const getPostsLikedByUser = (userId) => model.find({ userId });
export const deleteAllLikesOnRecipe = (recipeId) =>
  model.deleteMany({ recipeId });

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
