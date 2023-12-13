import * as dao from "../models/favCategories/dao.js";
import * as recipesDao from "../models/recipes/dao.js";
import * as mealDB from "../models/recipes/mealdbFunctions.js"

function FavCategories(app) {
    const addFavouriteCategory = async (req, res) => {
        try {
            const category = await dao.addFavouriteCategory(req.params.userId, req.params.category);
            res.json(category);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }

    };
    const removeFavouriteCategory = async (req, res) => {
        try {
            const status = await dao.removeFavouriteCategory(req.params.userId, req.params.category);
            res.json(status);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    const getCategoriesFavouritedByUser = async (req, res) => {
        try {
            const categories = await dao.getCategoriesFavouritedByUser(req.params.userId);
            res.json(categories);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    app.post("/api/favcategory/user/:userId/category/:category", addFavouriteCategory);
    app.delete("/api/favcategory/user/:userId/category/:category", removeFavouriteCategory);
    app.get("/api/favcategory/list/users/:userId", getCategoriesFavouritedByUser);
}

export default FavCategories;
