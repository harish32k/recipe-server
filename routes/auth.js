import dotenv from "dotenv";
import * as userDao from "../models/users/dao.js";
import * as tokenDao from "../models/refresh-tokens/dao.js";
import jwt from "jsonwebtoken";
import authenticationMiddleware from "../middleware/authenticationMiddleware.js";

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

    // console.log("Refresh token: ", refreshToken);

    try {
      await tokenDao.createToken(accessToken, refreshToken, userObj._id);
    } catch (err) {
      console.log(err);
    }
    // res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    req.session["refreshToken"] = refreshToken;
    req.session["accessToken"] = accessToken;
    // res.json({
    //   accessToken: accessToken,
    //   refreshToken: refreshToken,
    //   // message: "User logged in",
    // });
    res.json(userObj);
  };

  const token = async (req, res) => {
    // const refreshToken = req.body.token;
    const refreshToken = req.session["refreshToken"];
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
      req.session["accessToken"] = accessToken;
      // res.json({ accessToken: accessToken });
      res.sendStatus(200);
    });
  };

  const fetchUserdetails = async (req, res) => {
    res.json(req.user);
  };

  const signout = async (req, res) => {
    await tokenDao.deleteById(req.user._id);
    req.session.destroy();
    return res.sendStatus(204);
  };

  const verifyValidUser = async (req, res) => {
    console.log(req.user);
    res.json(req.user);
  };

  const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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

  const authenticateTokenFromSession = async (req, res, next) => {
    const token = req.session["accessToken"];
    if (token == null) return res.sendStatus(401);

    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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

  app.delete("/api/auth/signout", authenticationMiddleware(), signout);
  app.post("/api/auth/signin", signin);
  app.post("/api/auth/token", token);
  app.get(
    "/api/auth/user",
    authenticationMiddleware(["ADMIN", "CHEF", "CONSUMER"]),
    fetchUserdetails
  );
  app.get(
    "/api/auth/verify",
    authenticationMiddleware(["ADMIN"]),
    verifyValidUser
  );
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
