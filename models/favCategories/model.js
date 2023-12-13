import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("favCategories", schema);

export default model;
