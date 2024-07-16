const nodemailer = require('nodemailer');

exports.sendContactForm = async (req, res) => {
  const { name, firstName, email, message, subject } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "ali.khelifa@se.univ-bejaia.dz",
        pass: "nysn mjoy aotv bztg",
    }
  });

  const mailOptions = {
    from: email,
    to: 'gokhankabar@hotmail.fr',
    subject: `Contact : ${subject}`,
    text: `Vous avez reçu un nouveau message de votre formulaire de contact.\n\n` +
          `Nom: ${name}\n\n` +
          `Prénom: ${firstName}\n\n` +
          `Email: ${email}\n\n` +
          `Sujet: ${subject}\n\n` +
          `Message:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Error sending email: ' + error.message });
  }
};