import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRoutes from "./routes/users.js";
import AuthRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import MealRoutes from "./routes/mealDB.js";

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

UserRoutes(app);
AuthRoutes(app);
MealRoutes(app);

app.get("/", (req, res) => {
  res.send("Welcome to Recipe app API!");
});

app.listen(4000);
