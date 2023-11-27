import model from "./model.js";

export const createToken = (accessToken, refreshToken, _id) =>
  model.create({ accessToken, refreshToken, _id });
export const findToken = (refreshToken) => model.findOne({ refreshToken });
export const deleteAllTokens = () => model.deleteMany();
export const findById = (_id) => model.findById(_id);
export const deleteById = (_id) => model.deleteOne({ _id });
export const updateAccessToken = (accessToken, _id) =>
  model.updateOne({ _id }, { accessToken });
export const findByAccessToken = (accessToken) =>
  model.findOne({ accessToken });
