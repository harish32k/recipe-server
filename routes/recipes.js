import * as local from "../models/recipes/dao.js";
import * as mealDB from "../models/recipes/mealdbFunctions.js";
import * as likesDao from "../models/likes/dao.js";
import * as commentsDao from "../models/comments/dao.js";
import * as favCatDao from "../models/favCategories/dao.js";
import * as followDao from "../models/followers/dao.js";

import mongoose from "mongoose";

function convertToMutableObjects(recipes) {
  for (let i = 0; i < recipes.length; i++) {
    // Add properties to the recipe object
    recipes[i] = recipes[i].toObject();
  }
  return recipes;
}

function convertToIdString(id) {
  if (typeof id === "string") {
    // If it's already a string, return as is
    return id;
  } else if (mongoose.Types.ObjectId.isValid(id)) {
    // If it's a valid ObjectId, convert it to a string
    return id.toString();
  } else {
    // If it's neither a string nor a valid ObjectId, return null or handle it as needed
    return null; // or throw an error, log a message, etc.
  }
}

async function addLikesAndCommentsCountToSingleRecipe(recipe) {
  // Get likes count
  const strId = convertToIdString(recipe._id);
  const likeCount = await likesDao.getLikeCount(strId);
  const commentCount = await commentsDao.getCommentsCountOnRecipe(strId);
  recipe.likeCount = likeCount;
  recipe.commentCount = commentCount;
  return recipe;
}

async function addLikesAndCommentsCount(recipes) {
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    // const strId = convertToIdString(recipe._id);
    // // Get likes count
    // const likeCount = await likesDao.getLikeCount(strId);

    // console.log("This is: " +  strId);
    // // Set placeholder value for commentsCount
    // const commentCount = await commentsDao.getCommentsCountOnRecipe(strId);
    // console.log(commentCount);
    // // Add properties to the recipe object
    // recipes[i].likeCount = likeCount;
    // recipes[i].commentCount = commentCount;
    recipes[i] = await addLikesAndCommentsCountToSingleRecipe(recipe);
  }

  // console.log(recipes);
  // Now the recipes array contains added properties like likeCount and commentsCount for each recipe
  return recipes;
}

function addCategoryInfo(meals, category) {
  const transformedMeals = meals.map((meal) => {
    const transformedMeal = {
      ...meal,
      strCategory: category,
    };
    return transformedMeal;
  });
  return transformedMeals;
}

function addAreaInfo(meals, area) {
  const transformedMeals = meals.map((meal) => {
    const transformedMeal = {
      ...meal,
      strArea: area,
    };
    return transformedMeal;
  });
  return transformedMeals;
}

// export async function recipeFindHelper(_id) {
//     try {
//         const recipe = await local.findRecipeById(_id);
//         const updatedRecipe = await addLikesAndCommentsCountToSingleRecipe(recipe.toObject());
//         return updatedRecipe;
//     }
//     catch (error) {
//         const externRecipe = await mealDB.getMealById(_id);
//         if (externRecipe) {
//             const updatedRecipe = await addLikesAndCommentsCountToSingleRecipe(externRecipe[0]);
//             return updatedRecipe;
//         }
//         else {
//             return { message: "Recipe not found." };
//         }
//     }
// }

function RecipeRoutes(app) {
  const createRecipe = async (req, res) => {
    try {
      const recipe = await local.createRecipe(req.body);
      res.json(recipe);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  const deleteRecipe = async (req, res) => {
    try {
      const status = await local.deleteRecipe(req.params._id);
      await likesDao.deleteAllLikesOnRecipe(req.params._id);
      await commentsDao.deleteAllCommentsOnRecipe(req.params._id);
      res.json(status);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  const updateRecipe = async (req, res) => {
    try {
      const recipe = await local.updateRecipe(req.params._id, req.body);
      res.json(recipe);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  const approveRecipe = async (req, res) => {
    try {
      const recipe = await local.approveRecipe(req.params._id);
      res.json(recipe);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  const findAllRecipes = async (req, res) => {
    try {
      const recipes = await local.findAllRecipes();
      const result = await addLikesAndCommentsCount(recipes);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  const findRecipeById = async (req, res) => {
    try {
      const recipe = await local.findRecipeById(req.params._id);
      const updatedRecipe = await addLikesAndCommentsCountToSingleRecipe(
        recipe.toObject()
      );
      res.json(updatedRecipe);
    } catch (error) {
      try {
        const externRecipe = await mealDB.getMealById(req.params._id);
        if (externRecipe) {
          const updatedRecipe = await addLikesAndCommentsCountToSingleRecipe(
            externRecipe[0]
          );
          res.json(updatedRecipe);
        } else {
          res.status(401).json({ message: "Recipe not found." });
        }
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  };
  const findRecipesByName = async (req, res) => {
    try {
      const recipes = await local.findRecipesByName(req.params.inputString);
      const mutableRecipes = convertToMutableObjects(recipes);
      const externRecipes = await mealDB.getMealByName(req.params.inputString);
      const mergedRecipes = [...mutableRecipes, ...externRecipes];
      const result = await addLikesAndCommentsCount(mergedRecipes);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // const findRecipesByArea = async (req, res) => {
  //     try {
  //         const recipes = await local.findRecipesByArea(req.params.area);
  //         const mutableRecipes = convertToMutableObjects(recipes);
  //         const externRecipes = await mealDB.filterByArea(req.params.area);
  //         const mergedRecipes = [...mutableRecipes, ...externRecipes];
  //         const result = await addLikesAndCommentsCount(mergedRecipes);
  //         res.json(result);
  //     }
  //     catch (err) {
  //         res.status(400).json({ message: err.message });
  //     }
  // };

  const findRecipesByAreaSimple = async (req, res) => {
    try {
      const recipes = await local.findRecipesByAreaSimple(req.params.area);
      const mutableRecipes = convertToMutableObjects(recipes);
      const externRecipes = await mealDB.filterByAreaSimple(req.params.area);
      const mergedRecipes = [...mutableRecipes, ...externRecipes];
      const result = await addLikesAndCommentsCount(mergedRecipes);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // const findRecipesByCategory = async (req, res) => {
  //     try {
  //         const recipes = await local.findRecipesByCategory(req.params.category);
  //         const mutableRecipes = convertToMutableObjects(recipes);
  //         const externRecipes = await mealDB.filterByCategory(req.params.category);
  //         const mergedRecipes = [...mutableRecipes, ...externRecipes];
  //         const result = await addLikesAndCommentsCount(mergedRecipes);
  //         res.json(result);
  //     }
  //     catch (err) {
  //         res.status(400).json({ message: err.message });
  //     }
  // };

  const findRecipesByCategorySimple = async (req, res) => {
    try {
      const recipes = await local.findRecipesByCategorySimple(
        req.params.category
      );
      const mutableRecipes = convertToMutableObjects(recipes);
      const externRecipes = await mealDB.filterByCategorySimple(
        req.params.category
      );
      const mergedRecipes = [...mutableRecipes, ...externRecipes];
      const result = await addLikesAndCommentsCount(mergedRecipes);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const findUserRecipes = async (req, res) => {
    try {
      const recipes = await local.findRecipesByUserId(req.params.userId);
      const mutableRecipes = convertToMutableObjects(recipes);
      //const externRecipes = await mealDB.filterByCategorySimple(req.params.category);
      //const mergedRecipes = [...mutableRecipes, ...externRecipes];
      const result = await addLikesAndCommentsCount(mutableRecipes);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  async function findRandomRecipeHelper(category) {
    const recipes = await local.findRecipesByCategoryRandom(category, 3);
    const mutableRecipes = convertToMutableObjects(recipes);
    const externRecipes = await mealDB.filterByCategoryRandom(category, 5);
    const mergedRecipes = [...mutableRecipes, ...externRecipes];
    return mergedRecipes;
  }

  const findRecipesByCategoryRandom = async (req, res) => {
    try {
      const overallRecipes = [];
      overallRecipes.push(
        ...(await findRandomRecipeHelper(req.params.category))
      );
      const result = await addLikesAndCommentsCount(overallRecipes);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  };

  const findCompletelyRandomRecipesByRandomCategory = async (req, res) => {
    try {
      const overallRecipes = [];

      // Fetch all categories
      const categories = await mealDB.getMealCategories();

      // Shuffle the categories array to randomize the order
      const shuffledCategories = categories.sort(() => Math.random() - 0.5);

      // Select the first 4 categories from the shuffled array
      const selectedCategories = shuffledCategories.slice(0, 4);

      // console.log(selectedCategories);

      // Loop through each category
      for (const categoryObj of selectedCategories) {
        //console.log(categoryObj)
        const category = categoryObj.strCategory;
        // Retrieve recipes for the current category from local and external sources
        // Merge local and external recipes
        console.log(category);
        const mergedRecipes = await findRandomRecipeHelper(category);

        // Add the merged recipes to overallRecipes
        overallRecipes.push(...mergedRecipes);
      }

      // Calculate likes and comments count for all recipes in overallRecipes
      const result = await addLikesAndCommentsCount(overallRecipes);

      // Respond with the result
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  };

  const findRecipesByFavouriteCategoryRandom = async (req, res) => {
    try {
      const overallRecipes = [];

      // Fetch all categories
      const fetchedCategories = await favCatDao.getCategoriesFavouritedByUser(
        req.params.userId
      );

      const categories = fetchedCategories;

      // Shuffle the categories array to randomize the order
      const shuffledCategories = categories.sort(() => Math.random() - 0.5);

      // Select the first 4 categories from the shuffled array
      const selectedCategories = shuffledCategories.slice(0, 4);

      // console.log(selectedCategories);

      // Loop through each category
      for (const categoryObj of selectedCategories) {
        //console.log(categoryObj)
        const category = categoryObj.strCategory;
        // Retrieve recipes for the current category from local and external sources
        // Merge local and external recipes
        console.log(category);
        const mergedRecipes = await findRandomRecipeHelper(category);

        // Add the merged recipes to overallRecipes
        overallRecipes.push(...mergedRecipes);
      }

      // Calculate likes and comments count for all recipes in overallRecipes
      const result = await addLikesAndCommentsCount(overallRecipes);

      // Respond with the result
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  };

  const findRecipesFromSubscriptions = async (req, res) => {
    try {
      const overallRecipes = [];

      // Fetch all categories
      const following = await followDao.getFollowingPeople(req.params.userId);
      const followIds = following.map((item) => item.followId._id);
      //console.log(following)
      const recipes = await local.findRecipesOfMultipleUsers(followIds);

      const mutableRecipes = convertToMutableObjects(recipes);
      //const externRecipes = await mealDB.filterByCategorySimple(req.params.category);
      //const mergedRecipes = [...mutableRecipes, ...externRecipes];

      // Calculate likes and comments count for all recipes in overallRecipes
      const result = await addLikesAndCommentsCount(recipes);

      // Respond with the result
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  };

  app.post("/api/recipes", createRecipe);
  app.get("/api/recipes", findAllRecipes);
  app.get("/api/recipes/name/:inputString", findRecipesByName);
  app.get("/api/recipes/category/:category", findRecipesByCategorySimple);
  app.get("/api/recipes/area/:area", findRecipesByAreaSimple);
  app.get("/api/recipes/id/:_id", findRecipeById);
  app.put("/api/recipes/id/:_id", updateRecipe);
  app.delete("/api/recipes/id/:_id", deleteRecipe);
  app.get("/api/recipes/user/:userId", findUserRecipes);
  app.put("/api/recipes/approve/:_id", approveRecipe);
  app.get(
    "/api/recipes/random/category/simple/:category",
    findRecipesByCategoryRandom
  );
  app.get(
    "/api/recipes/random/category/complete-random",
    findCompletelyRandomRecipesByRandomCategory
  );
  app.get(
    "/api/recipes/random/category/favourite/:userId",
    findRecipesByFavouriteCategoryRandom
  );
  app.get("/api/recipes/subscribed/user/:userId", findRecipesFromSubscriptions);
}

export default RecipeRoutes;
