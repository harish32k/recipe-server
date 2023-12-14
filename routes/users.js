import * as dao from "../models/users/dao.js";
import * as favCatDao from "../models/favCategories/dao.js";
import authenticationMiddleware from "../middleware/authenticationMiddleware.js";

const processCategories = async (userId, favCategories) => {
  try {
    console.log("I am here")
    for (const category of favCategories) {
      console.log(category)
      await favCatDao.addFavouriteCategory(
        userId,
        category
      );
    }
    console.log('All categories processed'); // Optional: Log when all categories are processed
  } catch (error) {
    console.log(error)
    throw error('Error processing categories:', error);
  }
};

function UserRoutes(app) {
  const createUser = async (req, res) => {
    try {
      const user = req.body;
      //console.log(user)
      const favCategories = user.favoriteCategories;
      delete user.favouriteCategories;

      //console.log(user, user.favoriteCategories)
      const response = await dao.createUser(user);
      console.log(response)
      await processCategories(response._id.toString(), favCategories);
      console.log(response)
      console.log(response._id.toString())
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const findAllUsers = async (req, res) => {
    const users = await dao.findAllUsers();
    res.json(users);
  };
  const findUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await dao.findUserById(userId);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const updateUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = req.body;
      const response = await dao.updateUser(userId, user);
      res.json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const account = async (req, res) => { };
  const deleteUser = async (req, res) => { };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put(
    "/api/users/:userId",
    authenticationMiddleware(["ADMIN", "CHEF", "CONSUMER"]),
    updateUser
  );
  app.delete(
    "/api/users/:userId",
    authenticationMiddleware(["ADMIN", "CHEF", "CONSUMER"]),
    deleteUser
  );
  app.post("/api/users/account", account);
}

export default UserRoutes;
