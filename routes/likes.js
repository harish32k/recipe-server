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
        const status = await dao.removeLike(req.body.recipeId, req.body.userId);
        //console.log(req.body);
        //const status = {recipeId  : req.body.recipeId, userId : req.body.userId}
        res.json(status);
    };
    const getLikeCount = async (req, res) => {
        const likeCount = await dao.getLikeCount(req.params.recipeId);
        res.json({ "count" : likeCount});
    };
    const getLikedUsers = async (req, res) => {
        const users = await dao.getLikedUsers(req.body.recipeId);
        res.json(users);
    };
    const likedStatus = async (req, res) => {
        const isLiked = await dao.isPostLikedByCurrentUser(req.params.recipeId, req.params.userId);
        res.json({ "liked" : isLiked === 1 ? true : false});
    };
    const getPostsLikedByUser = async (req, res) => {
        const likes = await dao.getPostsLikedByUser(req.params.userId);
        const mutableLikes = convertToMutableObjects(likes);
        const populatedLikes = await addRecipeDetails(mutableLikes);
        res.json(populatedLikes);
    };

    app.post("/api/like", addLike);
    app.delete("/api/like/delete", removeLike);
    app.get("/api/like/users/:userId", getLikedUsers);
    app.get("/api/like/count/:recipeId", getLikeCount);
    app.get("/api/like/liked-status/recipe/:recipeId/user/:userId", likedStatus);
    app.get("/api/like/user-liked/:userId", getPostsLikedByUser);
}

export default LikeRoutes;
