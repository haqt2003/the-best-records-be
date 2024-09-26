const nodemailer = require("nodemailer");

const sendMail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "The Best Records", // sender address
      to: email,
      subject: "THE BEST RECORDS - Forgot password", // Subject line
      text: `Mã xác thực của bạn là: ${code}`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });
  } catch (error) {
    console.error;
  }
};

module.exports = sendMail;
