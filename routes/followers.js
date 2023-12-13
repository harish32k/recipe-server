import * as dao from "../models/followers/dao.js";

function FollowerRoutes(app) {
    const addFollow = async (req, res) => {
        try {
            const follow = await dao.addFollow(req.params.userId, req.params.followId);
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
    const getFollowingCount = async (req, res) => {
        try {
            const followingCount = await dao.countUserFollowings(req.params.userId);
            res.json({ "count": followingCount });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    const getFollowerCount = async (req, res) => {
        try {
            const followerCount = await dao.countUserFollowers(req.params.userId);
            res.json({ "count": followerCount });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    const followingUsers = async (req, res) => {
        try {
            const followings = await dao.getFollowingPeople(req.params.userId);
            res.json(followings);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    const followerUsers = async (req, res) => {
        try {
            const followers = await dao.getFollowerPeople(req.params.userId);
            res.json(followers);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    app.post("/api/follow/user/:userId/following/:followId", addFollow);
    app.delete("/api/follow/user/:userId/following/:followId", removeFollow);
    app.get("/api/follow/count/following/:userId", getFollowingCount);
    app.get("/api/follow/count/followers/:userId", getFollowerCount);
    app.get("/api/follow/list/following/:userId", followingUsers);
    app.get("/api/follow/list/followers/:userId", followerUsers);
}

export default FollowerRoutes;
