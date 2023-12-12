import * as dao from "../models/likes/dao.js";
import * as recipesDao from "../models/recipes/dao.js";
import * as mealDB from "../models/recipes/mealdbFunctions.js"


export async function recipeFindHelper(_id) {
    try {
        const recipe = await recipesDao.findRecipeById(_id);
        return recipe;
    }
    catch (error) {
        const externRecipe = await mealDB.getMealById(_id);
        if (externRecipe) {
            return externRecipe[0];
        }
        else {
            return { message: "Recipe not found." };
        }
    }
}

function convertToMutableObjects(likes) {
    for (let i = 0; i < likes.length; i++) {
        likes[i] = likes[i].toObject();
    }
    return likes;
}

async function addRecipeDetails(likes) {
    for (let like of likes) {
        const recipeId = like.recipeId;

        // Use the fetchRecipeDetails async function to get recipe details
        const recipeDetails = await recipeFindHelper(recipeId);

        // Update the like object with the fetched recipe details
        like.recipe = recipeDetails; // Assuming the fetched details are stored in 'recipe'
    }
    return likes;
}

function LikeRoutes(app) {
    const addLike = async (req, res) => {
        try {
            const like = await dao.addLike(req.body.recipeId, req.body.userId);
            res.json(like);
        }
        catch (error) {
            res.status(400).json({ error: "Like couldn't be added." });
        }

    };
    const removeLike = async (req, res) => {
        try {
            const status = await dao.removeLike(req.body.recipeId, req.body.userId);
            //console.log(req.body);
            //const status = {recipeId  : req.body.recipeId, userId : req.body.userId}
            res.json(status);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    const getLikeCount = async (req, res) => {
        try {
            const likeCount = await dao.getLikeCount(req.params.recipeId);
            res.json({ "count": likeCount });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    const getLikedUsers = async (req, res) => {
        try {
            const users = await dao.getLikedUsers(req.params.recipeId);
            res.json(users);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    const likedStatus = async (req, res) => {
        // res.json({ "liked": false });
        // console.log(req.params)
        try {
            const isLiked = await dao.isPostLikedByCurrentUser(req.params.recipeId, req.params.userId);
            res.json({ "liked": isLiked === 1 ? true : false });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    const getPostsLikedByUser = async (req, res) => {
        try {
            const likes = await dao.getPostsLikedByUser(req.params.userId);
            const mutableLikes = convertToMutableObjects(likes);
            const populatedLikes = await addRecipeDetails(mutableLikes);
            res.json(populatedLikes);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    app.post("/api/like", addLike);
    app.delete("/api/like/delete", removeLike);
    app.get("/api/like/users/:recipeId", getLikedUsers);
    app.get("/api/like/count/:recipeId", getLikeCount);
    app.get("/api/like/liked-status/recipe/:recipeId/user/:userId", likedStatus);
    app.get("/api/like/user-liked/:userId", getPostsLikedByUser);
}

export default LikeRoutes;
