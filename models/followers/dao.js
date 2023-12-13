import model from "./model.js";

export const addFollow = (userId, followId) =>
  model.create({ userId, followId, likedTime: Date.now() });
export const removeFollow = (userId, followId) =>
  model.deleteOne({ userId: userId, followId: followId });
export const countUserFollowings = (_id) =>
  model.countDocuments({ userId: _id });
export const countUserFollowers = (_id) =>
  model.countDocuments({ followId: _id });
export const getFollowingPeople = (_id) =>
  model
    .find({ userId: _id })
    .populate("userId", "firstName lastName username")
    .populate("followId", "firstName lastName username");
export const getFollowerPeople = (_id) =>
  model
    .find({ followId: _id })
    .populate("userId", "firstName lastName username")
    .populate("followId", "firstName lastName username");
export const isCurrentUserFollowingThisUser = (userId, followId) =>
  model.countDocuments({ userId, followId });