import model from "./model.js";

export const addComment = (recipeId, userId, strComment) => model.create({ recipeId, userId, strComment, commentedTime: Date.now() });
export const removeComment = (_id) => model.deleteOne({ _id: _id });
export const getCommentsCountOnRecipe = (recipeId) => model.countDocuments({ recipeId });
export const getCommentsOnRecipe = (recipeId) => model.find({ recipeId }).populate("userId", "firstName lastName username");
export const getAllCommentsByUser = (userId) => model.find({ userId }).populate("userId", "firstName lastName username");
export const deleteAllCommentsOnRecipe = (recipeId) => model.deleteMany({ recipeId });

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
