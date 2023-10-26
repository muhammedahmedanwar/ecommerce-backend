const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // if secure false , port=587 && secure true, port=465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASS,
    },
  });
  // define email options
  const mailOptions = {
    from: "E-shop App <mgego0581@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
