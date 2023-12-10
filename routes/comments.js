import * as dao from "../models/comments/dao.js";
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

function convertToMutableObjects(comments) {
    for (let i = 0; i < comments.length; i++) {
        comments[i] = comments[i].toObject();
    }
    return comments;
}

async function addRecipeDetails(comments) {
    for (let comment of comments) {
        const recipeId = comment.recipeId;

        // Use the fetchRecipeDetails async function to get recipe details
        const recipeDetails = await recipeFindHelper(recipeId);

        // Update the comment object with the fetched recipe details
        comment.recipe = recipeDetails; // Assuming the fetched details are stored in 'recipe'
    }
    return comments;  
}

function CommentRoutes(app) {
    const addComment = async (req, res) => {
        try {
            const comment = await dao.addComment(req.body.recipeId, req.body.userId, req.body.strComment);
            res.json(comment);
        }
        catch (error) {
            res.status(400).json({ error: "Comment couldn't be added." });
        }
        
    };
    const removeComment = async (req, res) => {
        const status = await dao.removeComment(req.body.recipeId, req.body.userId);
        //console.log(req.body);
        //const status = {recipeId  : req.body.recipeId, userId : req.body.userId}
        res.json(status);
    };
    const getCommentsCountOnRecipe = async (req, res) => {
        const commentCount = await dao.getCommentsCountOnRecipe(req.body.recipeId);
        res.json({ "count" : commentCount});
    };
    const getUserCommentsOnRecipe = async (req, res) => {
        const comments = await dao.getCommentsOnRecipe(req.body.recipeId);
        res.json(comments);
    };

    const getAllCommentsByUser = async (req, res) => {
        const comments = await dao.getAllCommentsByUser(req.body.userId);
        const mutableComments = convertToMutableObjects(comments);
        const populatedComments = await addRecipeDetails(mutableComments);
        res.json(populatedComments);
    };

    app.post("/api/comment", addComment);
    app.get("/api/comment", getUserCommentsOnRecipe);
    app.delete("/api/comment", removeComment);
    app.get("/api/comment/count", getCommentsCountOnRecipe);
    app.get("/api/comment/user", getAllCommentsByUser);
}

export default CommentRoutes;