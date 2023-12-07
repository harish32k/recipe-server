import * as local from "../models/recipes/dao.js";
import * as mealDB from "../models/recipes/mealdbFunctions.js"
import * as likesDao from "../models/likes/dao.js"


function convertToMutableObjects(recipes) {
    for (let i = 0; i < recipes.length; i++) {
        // Add properties to the recipe object
        recipes[i] = recipes[i].toObject();
    }
    return recipes;
}

async function addLikesAndCommentsCount(recipes) {
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];

        // Get likes count
        const likeCount = await likesDao.getLikeCount(recipe._id);

        // Set placeholder value for commentsCount
        const commentCount = 0;

        // Add properties to the recipe object
        recipes[i].likeCount = likeCount;
        recipes[i].commentCount = commentCount;
    }

    // Now the recipes array contains added properties like likeCount and commentsCount for each recipe
    return recipes;
}

function RecipeRoutes(app) {

    const createRecipe = async (req, res) => {
        try {
            const recipe = await local.createRecipe(req.body);
            res.json(recipe);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    };
    const deleteRecipe = async (req, res) => {
        try {
            const status = await local.deleteRecipe(req.params._id);
            res.json(status);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    };
    const updateRecipe = async (req, res) => {
        try {
            const recipe = await local.updateRecipe(req.params._id, req.body);
            res.json(recipe);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    };
    const findAllRecipes = async (req, res) => {
        try {
            const recipes = await local.findAllRecipes();
            const result = await addLikesAndCommentsCount(recipes);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    };
    const findRecipeById = async (req, res) => {
        try {
            const recipe = await local.findRecipeById(req.params._id);
            res.json(recipe);
        }
        catch (error) {
            const externRecipe = await mealDB.getMealById(req.params._id);
            if (externRecipe) {
                res.json(externRecipe[0]);
            }
            else {
                res.status(401).json({ message: "Recipe not found." });
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
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    };
    const findRecipesByArea = async (req, res) => {
        try {
            const recipes = await local.findRecipesByArea(req.params.area);
            const mutableRecipes = convertToMutableObjects(recipes);
            const externRecipes = await mealDB.filterByArea(req.params.area);
            const mergedRecipes = [...mutableRecipes, ...externRecipes];
            const result = await addLikesAndCommentsCount(mergedRecipes);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    };
    const findRecipesByCategory = async (req, res) => {
        try {
            const recipes = await local.findRecipesByCategory(req.params.category);
            const mutableRecipes = convertToMutableObjects(recipes);
            const externRecipes = await mealDB.filterByCategory(req.params.category);
            const mergedRecipes = [...mutableRecipes, ...externRecipes];
            const result = await addLikesAndCommentsCount(mergedRecipes);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    };


    app.post("/api/recipes", createRecipe);
    app.get("/api/recipes", findAllRecipes);
    app.get("/api/recipes/name/:inputString", findRecipesByName);
    app.get("/api/recipes/category/:category", findRecipesByCategory);
    app.get("/api/recipes/area/:area", findRecipesByArea);
    app.get("/api/recipes/id/:_id", findRecipeById);
    app.put("/api/recipes/id/:_id", updateRecipe);
    app.delete("/api/recipes/id/:_id", deleteRecipe);
}

export default RecipeRoutes;
