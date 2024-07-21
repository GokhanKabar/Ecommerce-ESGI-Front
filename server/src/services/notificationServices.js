const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "ali.khelifa@se.univ-bejaia.dz",
    pass: "nysn mjoy aotv bztg",
  }
});

async function notifyUsers(alerts, subject, message) {
    const { User } = require("../databases/sequelize/models");
    for (const alert of alerts) {
      const user = await User.findByPk(alert.userId);
      if (user) {
        await sendEmail(user.email, subject, message);
      }
    }
  }



async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: "ali.khelifa@se.univ-bejaia.dz",
    to: to,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
}

module.exports = {
  notifyUsers
};
