import dotenv from "dotenv";
import * as userDao from "../models/users/dao.js";
import * as tokenDao from "../models/refresh-tokens/dao.js";
import jwt from "jsonwebtoken";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function AuthRoutes(app) {
  resetTokens();

  const signin = async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    const user = await userDao.findUserByCredentials(username, password);
    if (!user || user == null) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const userObj = { _id: user._id, username: user.username, role: user.role };
    const accessToken = generateAccessToken(userObj);
    const refreshToken = generateRefreshToken(userObj);

    const existingToken = await tokenDao.findById(userObj._id);

    if (existingToken) {
      try {
        const decodedToken = jwt.verify(
          existingToken.refreshToken,
          REFRESH_TOKEN_SECRET
        );
        return res.status(403).json({ message: "User already logged in" });
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          await tokenDao.deleteById(userObj._id);
        }
      }
    }

    console.log("Refresh token: ", refreshToken);

    try {
      await tokenDao.createToken(accessToken, refreshToken, userObj._id);
    } catch (err) {
      console.log(err);
    }
    // res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      // message: "User logged in",
    });
  };

  const token = async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    if (!(await tokenDao.findToken(refreshToken))) return res.sendStatus(403);
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const userObj = {
        _id: user._id,
        username: user.username,
        role: user.role,
      };
      const accessToken = generateAccessToken(userObj);
      await tokenDao.updateAccessToken(accessToken, userObj._id);
      res.json({ accessToken: accessToken });
    });
  };

  const fetchUserdetails = async (req, res) => {
    res.json(req.user);
  };

  const signout = async (req, res) => {
    await tokenDao.deleteById(req.user._id);
    return res.sendStatus(204);
    // const refreshToken = req.body.token;
    // jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, user) => {
    //   if (err) {
    //     if (err.name === "TokenExpiredError") {
    //       return res
    //         .status(403)
    //         .json({ message: "Token expired, User logged out" });
    //     }
    //     return res.sendStatus(403);
    //   }
    //   await tokenDao.deleteById(user._id);
    //   return res.sendStatus(204);
    // });
  };

  const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    try {
      const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = user;

      const accessToken = await tokenDao.findByAccessToken(token);
      if (!accessToken) {
        return res.sendStatus(401);
      } else {
        next();
      }
    } catch (error) {
      return res.sendStatus(403);
    }
  };

  app.delete("/api/auth/signout", authenticateToken, signout);
  app.post("/api/auth/signin", signin);
  app.post("/api/auth/token", token);
  app.get("/api/auth/user", authenticateToken, fetchUserdetails);
}

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "2m" });
}

async function resetTokens() {
  await tokenDao.deleteAllTokens();
}

export default AuthRoutes;
