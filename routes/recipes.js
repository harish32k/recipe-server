import * as local from "../models/recipes/dao.js";

function RecipeRoutes(app) {
    const createRecipe = async (req, res) => {
        const recipe = await local.createRecipe(req.body);
        res.json(recipe);
    };
    const deleteRecipe = async (req, res) => {
        const status = await local.deleteRecipe(req.params._id);
        res.json(status);
    };
    const findAllRecipes = async (req, res) => {
        const recipes = await local.findAllRecipes();
        res.json(recipes);
    };
    const findRecipeById = async (req, res) => {
        const recipe = await local.findRecipeById(req.params._id);
        res.json(recipe);
    };
    const findRecipesByName = async (req, res) => {
        const recipes = await local.findRecipesByName(req.params.inputString);
        res.json(recipes);
    };
    const findRecipesByArea = async (req, res) => {
        const recipes = await local.findRecipesByArea(req.params.area);
        res.json(recipes);
    };
    const findRecipesByCategory = async (req, res) => {
        const recipes = await local.findRecipesByCategory(req.params.category);
        res.json(recipes);
    };
    const updateRecipe = async (req, res) => {
        const recipe = await local.updateRecipe(req.params._id, req.body);
        res.json(recipe);
    };


    app.post("/api/recipes", createRecipe);
    app.get("/api/recipes", findAllRecipes);
    app.get("/api/recipes/:_id", findRecipeById);
    app.get("/api/recipes/name/:inputString", findRecipesByName);
    app.get("/api/recipes/category/:category", findRecipesByCategory);
    app.get("/api/recipes/area/:area", findRecipesByArea);
    app.put("/api/recipes/:_id", updateRecipe);
    app.delete("/api/recipes/:_id", deleteRecipe);
}

export default RecipeRoutes;
