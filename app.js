import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRoutes from "./routes/users.js";
import AuthRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

dotenv.config();

const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASS;
const dbname = process.env.DB_NAME;

mongoose.connect(
  `mongodb+srv://${dbuser}:${dbpassword}@recipedb.yehwxms.mongodb.net/${dbname}?retryWrites=true&w=majority`
);

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.use(authenticationMiddleware);

UserRoutes(app);
AuthRoutes(app);

app.get("/", (req, res) => {
  res.send("Welcome to Recipe app API!");
});

// app.get("/posts", authenticateToken, (req, res) => {
//   res.json(req.user);
// });

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

app.listen(4000);
