import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("followers", schema);

export default model;
