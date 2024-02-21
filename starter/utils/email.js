const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1 --> Create Transpoter
  const trasporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSOWRD,
    },
  });

  // 2 --> Define the email options
  const mailOptions = {
    from: 'Sonu Acharya <sonuacharya710@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3 --> Actually send the email
  await trasporter.sendMail(mailOptions);
};

module.exports = sendEmail;
