import mongoose from "mongoose";
const refreshTokenSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    refreshToken: { type: String, required: true, unique: true },
    accessToken: { type: String },
  },
  { collection: "refreshTokens" }
);
export default refreshTokenSchema;
