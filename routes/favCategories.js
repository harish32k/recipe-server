import * as dao from "../models/favCategories/dao.js";
import authenticationMiddleware from "../middleware/authenticationMiddleware.js";
import * as recipesDao from "../models/recipes/dao.js";
import * as mealDB from "../models/recipes/mealdbFunctions.js";

function FavCategories(app) {
  const addFavouriteCategory = async (req, res) => {
    try {
      const category = await dao.addFavouriteCategory(
        req.params.userId,
        req.params.category
      );
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const removeFavouriteCategory = async (req, res) => {
    try {
      const status = await dao.removeFavouriteCategory(
        req.params.userId,
        req.params.category
      );
      res.json(status);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const getCategoriesFavouritedByUser = async (req, res) => {
    try {
      const categories = await dao.getCategoriesFavouritedByUser(
        req.params.userId
      );
      res.json(categories);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const checkCategoryFavouritedByUser = async (req, res) => {
    try {
      const favourited = await dao.didUserFavouriteThisCategory(
        req.params.userId,
        req.params.category
      );
      res.json({
        strCategory: req.params.category,
        favourited: favourited === 1 ? true : false,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  app.post(
    "/api/favcategory/user/:userId/category/:category",
    authenticationMiddleware(["ADMIN", "CHEF", "CONSUMER"]),
    addFavouriteCategory
  );
  app.delete(
    "/api/favcategory/user/:userId/category/:category",
    authenticationMiddleware(["ADMIN", "CHEF", "CONSUMER"]),
    removeFavouriteCategory
  );
  app.get("/api/favcategory/list/users/:userId", getCategoriesFavouritedByUser);
  app.get(
    "/api/favcategory/status/users/:userId/category/:category",
    checkCategoryFavouritedByUser
  );
}

export default FavCategories;
