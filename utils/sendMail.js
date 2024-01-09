import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendEmail = async (email, subject, payload) => {
  console.log("Sending Email...");
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });
    console.log(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    let mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: subject,
      text: JSON.stringify(payload),
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error in sending mail");
        console.log(err);
        return false;
      }
      console.log("Email send successfully");
    });
  } catch (error) {
    console.log("Error while sending mail", error);
  }
};
