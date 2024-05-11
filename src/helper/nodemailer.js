const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  
const sendMail = async (mailOptions) => {
      const info = await transporter.sendMail(mailOptions);
      return info;   
    }

module.exports = sendMail;