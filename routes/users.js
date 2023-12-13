import * as dao from "../models/users/dao.js";
import authenticationMiddleware from "../middleware/authenticationMiddleware.js";

function UserRoutes(app) {
  const createUser = async (req, res) => {};
  const deleteUser = async (req, res) => {};
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
  const updateUser = async (req, res) => {};
  const signup = async (req, res) => {};
  const signout = (req, res) => {};
  const account = async (req, res) => {};

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
  app.post("/api/users/signup", signup);
  app.post("/api/users/account", account);
}

export default UserRoutes;
