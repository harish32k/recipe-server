import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
  strArea: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  strDescription: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  strAreaThumb: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export default areaSchema;
