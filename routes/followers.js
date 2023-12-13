import * as dao from "../models/followers/dao.js";

function FollowerRoutes(app) {
    const addFollow = async (req, res) => {
        try {
            const follow = await dao.addFollow(req.body.userId, req.body.followId);
            res.json(follow);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }

    };
    const removeFollow = async (req, res) => {
        try {
            const status = await dao.removeFollow(req.params.userId, req.params.followId);
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

    app.post("/api/follow", addFollow);
    app.delete("/api/follow/follower/user/:userId/following/:followId", removeFollow);
    app.get("/api/follow/count/following/:userId", followingCount);
    app.get("/api/follow/count/followers/:userId", followerCount);
    app.get("/api/follow/list/following/:userId", followingUsers);
    app.get("/api/follow/list/followers/:userId", followerUsers);
}

export default LikeRoutes;
