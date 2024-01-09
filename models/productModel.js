import  mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  colourname: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  picturecolour: {
    type: String,
    required: true,
    trim: true,
  },
  demo: {
    type: String,
    required: true,
    trim: true,
  }
});

const Products = mongoose.model("Products", productsSchema);
export {Products};