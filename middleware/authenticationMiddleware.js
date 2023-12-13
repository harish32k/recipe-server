import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import * as tokenDao from "../models/refresh-tokens/dao.js";

dotenv.config();

const authenticationMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const token = req.session["accessToken"];
    if (token == null) return res.status(401).json({ message: "Unauthorized" });

    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const accessToken = await tokenDao.findByAccessToken(token);
      if (!accessToken) {
        return res.status(403).json({ message: "Invalid Access Token" });
      } else {
        req.user = user;
        if (roles && roles.length > 0 && !roles.includes(user.role)) {
          return res.status(403).json({ message: "Insufficient permissions" });
        }
        next();
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(403)
          .json({ message: "Token expired, User logged out" });
      }
      return res.status(403).json({ message: "Forbidden" });
    }
  };
};

export default authenticationMiddleware;
