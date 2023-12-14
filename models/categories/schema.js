import mongoose from "mongoose";

const schema = new mongoose.Schema({
  strCategory: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  strCategoryThumb: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  strCategoryDescription: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export default schema;
