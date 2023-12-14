import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import UserRoutes from "./routes/users.js";
import AuthRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import MealRoutes from "./routes/mealDB.js";
import RecipeRoutes from "./routes/recipes.js";
import LikeRoutes from "./routes/likes.js";
import CommentRoutes from "./routes/comments.js";
import bodyParser from "body-parser";
import FollowerRoutes from "./routes/followers.js";
import FavCategories from "./routes/favCategories.js";
import DomainRoutes from "./routes/domains.js";

dotenv.config();

const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASS;
const dbname = process.env.DB_NAME;

mongoose.connect(
  `mongodb+srv://${dbuser}:${dbpassword}@recipedb.yehwxms.mongodb.net/${dbname}?retryWrites=true&w=majority`
);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

UserRoutes(app);
AuthRoutes(app);
MealRoutes(app);
RecipeRoutes(app);
LikeRoutes(app);
CommentRoutes(app);
FollowerRoutes(app);
FavCategories(app);
DomainRoutes(app);

app.get("/", (req, res) => {
  res.send("Welcome to Recipe app API!");
});

app.listen(process.env.PORT || 4000);
