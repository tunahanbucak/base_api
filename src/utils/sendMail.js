const nodemailer = require("nodemailer");
const APIError = require("./errors");

const sendEmail = async (mailOptions) => {
  const transporter = await nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new APIError("Mail gonderilemedi!");
    }
    return true;
  });
};

module.exports = sendEmail;
