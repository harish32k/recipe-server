import model from "./model.js";

export const createRecipe = (recipe) => model.create({ ...recipe, postedTime: Date.now() });
export const findAllRecipes = () => model.find().populate("userId", "firstName lastName username");
export const findRecipeById = (_id) => model.findOne({ _id: _id }) //.populate("userId", "firstName lastName username");
export const findRecipesByName = (inputString) =>
  model.find({ strMeal: { $regex: new RegExp(inputString, 'i') } }).populate("userId", "firstName lastName username");
export const findRecipesByCategory = (category) => model.find({ strCategory: category }).populate("userId", "firstName lastName username");
export const findRecipesByArea = (area) => model.find({ strArea: area }).populate("userId", "firstName lastName username");
export const findRecipesByCategorySimple =
  (category) => model.find({ strCategory: category })
    .select("_id strMeal strMealThumb postedTime approved userId source")
    .populate("userId", "firstName lastName username");
export const findRecipesByAreaSimple =
  (area) => model.find({ strArea: area })
    .select("_id strMeal strMealThumb postedTime approved userId source")
    .populate("userId", "firstName lastName username");
export const findRecipesByUserId = (userId) => model.find({ userId }).populate("userId", "firstName lastName username");
export const updateRecipe = (_id, recipe) =>
  model.updateOne({ _id: _id }, { $set: recipe });
export const approveRecipe = (_id) =>
  model.updateOne({ _id: _id }, { $set: { approved: true } });
export const deleteRecipe = (_id) => model.deleteOne({ _id: _id });

export const findRecipesByCategoryRandom = async (category, n) => {
  try {
    const filteredItemsQuery = model.find({ strCategory: category })
      .select("_id strMeal strMealThumb postedTime approved userId source strCategory")
      .populate("userId", "firstName lastName username"); // Apply your filter
    // Execute the query to get the array of filtered items
    const filteredItems = await filteredItemsQuery.exec();


    // Shuffle the filtered items randomly
    const shuffledItems = filteredItems.sort(() => Math.random() - 0.5);

    // Check if the number of filtered items is less than 'n'
    if (shuffledItems.length <= n) {
      return shuffledItems; // Return all filtered items if they're fewer than 'n'
    } else {
      // Get the first 'n' items from the shuffled array
      const randomItems = shuffledItems.slice(0, n);
      return randomItems;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findRecipesOfMultipleUsers = (usersIds) => model.find({ userId: { $in: usersIds } }).select("_id strMeal strMealThumb postedTime approved userId source strCategory").populate("userId", "firstName lastName username");


// export const findRecipesByIngredients = (ingredientList) =>
//   model.find({ ingredients: { $in: ingredientList } });