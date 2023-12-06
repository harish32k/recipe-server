import * as dao from "../models/likes/dao.js";

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
        console.log(req.body);
        //const status = {recipeId  : req.body.recipeId, userId : req.body.userId}
        res.json(status);
    };
    const getLikeCount = async (req, res) => {
        const likeCount = await dao.getLikeCount(req.body.recipeId);
        res.json({ "count" : likeCount});
    };
    const getLikedUsers = async (req, res) => {
        const users = await dao.getLikedUsers(req.body.recipeId);
        res.json(users);
    };
    const likedStatus = async (req, res) => {
        const isLiked = await dao.isPostLikedByCurrentUser(req.body.recipeId, req.body.userId);
        res.json({ "liked" : isLiked === 1 ? true : false});
    };
    const getPostsLikedByUser = async (req, res) => {
        const status = await dao.getPostsLikedByUser(req.body.userId);
        res.json(status);
    };

    app.post("/api/like", addLike);
    app.delete("/api/like/delete", removeLike);
    app.get("/api/like/users", getLikedUsers);
    app.get("/api/like/count", getLikeCount);
    app.get("/api/like/liked-status", likedStatus);
    app.get("/api/like/user-liked", getPostsLikedByUser);
}

export default LikeRoutes;
