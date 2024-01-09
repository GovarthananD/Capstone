import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DB } from "./DB/db.js";
import { userRouter } from "./routes/authentication.js";
import cookieParser from "cookie-parser";
import {productRouter}  from "./routes/productroute.js";



dotenv.config();

//middlewares
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//connecting database
DB();

//routes
app.use(userRouter);
app.use(productRouter);

app.get("/", (req, res) => {
  res.send({ message: "Welcome" });
});

//server connection
app.listen(process.env.PORT, () => console.log("Server running on PORT"));
