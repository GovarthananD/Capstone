import express from "express";
const router = express.Router();
import { Products } from "../models/productModel.js";
import { isAuthenticated } from "../controllers/authorization.js";

router.post("/addProduct", (req, res) => {
  try {
    let newProduct = new Products(req.body);
    newProduct
      .save()
      .then((data) => {
        res
          .status(200)
          .send({ message: "Product has been added successfully", data });
      })
      .catch((error) => {
        res.status(400).send({ message: "Error while adding product" });
      });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/getAllProducts", isAuthenticated, (req, res) => {
  try {
    console.log("i am here");
    Products.find()
      .then((data) =>
        res.status(200).send({
          message: "Product has been retrieved successfully",
          data: data,
        })
      )
      .catch((error) => {
        console.log(error)
        // res.status(400).send({ message: "Error while retrieving Product" });
      });
  
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export const productRouter = router;
