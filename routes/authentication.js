import express from "express";
import bcrypt from "bcrypt";
import { User, generateToken } from "../models/userModels.js";
import { getUserByEmail } from "../controllers/userroutes.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendMail.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const user = await getUserByEmail(req);
    if (!user) {
      return res.status(404).send({ message: "User doesn't exist" });
    }
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(user, req.body, validatePassword);
    if (!validatePassword) {
      return res.status(400).send({ message: "Invalid Password" });
    }
    const token = generateToken(user._id);
    res.status(200).send({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(400).send({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    let user = await getUserByEmail(req);
    if (user) {
      res.status(400).send({ message: "User already excist" });
    }
    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      password: hashedPassword,
    }).save();
    const token = generateToken(user._id);
    res.status(201).send({ message: "User created successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Enter the E-mail" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    let newToken = crypto.randomBytes(32).toString("hex");

    await User.findOneAndUpdate({ email: email }, { token: newToken });

    const link = `http://localhost:8080/forgotpassword?token=${newToken}&id=${user._id}`;
    console.log(link);

    await sendEmail(user.email, "Forgot-Password Link", {
      name: user.name,
      link: link,
    });
    return res
      .status(200)
      .send({ message: "Email has been send Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Internal Server Error" });
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;
    const resetToken = await User.findOne({ _id: userId });
    if (!resetToken) {
      return res.status(400).send({ message: "Invalid or expired token" });
    }
    console.log(resetToken);
    const isValid = resetToken.token == token;
    if (!isValid) {
      return res.status(400).send({ message: "Invalid token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 13);
    User.findByIdAndUpdate(
      { _id: userId },
      { $set: { hashedPassword: hashedPassword } }
    ).catch((error) => {
      res.status(400).send({ message: "Error while updating user password" });
    });
    await resetToken.deleteOne();
    return res.status(200).send({ message: "Reset password is successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// router.get("/logout", async (req, res) => {
//   try {
//     await localStorage.removeItem("x-auth-token");
//     res.status(200).send({ message: "User Logged Out!" });
//   } catch (error) {
//     res.status(400).send({ message: "Internal Server Error" });
//   }
// });

export const userRouter = router;
