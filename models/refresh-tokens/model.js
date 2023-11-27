import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("refreshTokens", schema);

export default model;
