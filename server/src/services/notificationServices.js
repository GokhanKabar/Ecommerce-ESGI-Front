const nodemailer = require('nodemailer');
const { Op, Sequelize } = require('sequelize');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "ali.khelifa@se.univ-bejaia.dz",
    pass: "nysn mjoy aotv bztg",
  }
});

async function notifyUsers(alerts, subject, html) {
  const { User } = require("../databases/sequelize/models");
  for (const alert of alerts) {
    const user = await User.findByPk(alert.userId);
    if (user) {
      await sendEmail(user.email, subject, html);
    }
  }
}

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: "ali.khelifa@se.univ-bejaia.dz",
    to: to,
    subject: subject,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
}

function createTemplate(subject, content) {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
      }
      p {
        color: #555;
      }
      a {
        color: #0066cc;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${content}
      <p>Cordialement,</p>
      <p>L'équipe de votre boutique</p>
    </div>
  </body>
  </html>
  `;
}

// Notify users about restock
async function notifyRestock(productId) {
  const { Alert, Product } = require("../databases/sequelize/models");

  const product = await Product.findByPk(productId);
  if (!product) return;

  const alerts = await Alert.findAll({
    where: Sequelize.literal(`JSON_CONTAINS(restock_product_ids, '[${productId}]')`)
  });

  const subject = `Alerte de réapprovisionnement : ${product.name}`;
  const content = `
    <h1>Alerte de Réapprovisionnement</h1>
    <p>Le produit <strong>${product.name}</strong> est de nouveau en stock.</p>
  `;
  const html = createTemplate(subject, content);

  await notifyUsers(alerts, subject, html);
}

// Notify users about price change
async function notifyPriceChange(productId) {
  const { Alert, Product } = require("../databases/sequelize/models");

  const product = await Product.findByPk(productId);
  if (!product) return;

  const alerts = await Alert.findAll({
    where: Sequelize.literal(`JSON_CONTAINS(price_change_product_ids, '[${productId}]')`)
  });

  const subject = `Alerte de changement de prix : ${product.name}`;
  const content = `
    <h1>Alerte de Changement de Prix</h1>
    <p>Le prix du produit <strong>${product.name}</strong> a changé.</p>
  `;
  const html = createTemplate(subject, content);

  await notifyUsers(alerts, subject, html);
}

// Notify users about new product in a category
async function notifyNewProduct(category) {
  const { Alert } = require("../databases/sequelize/models");

  const alerts = await Alert.findAll({
    where: Sequelize.literal(`JSON_CONTAINS(new_product_categories, '["${category}"]')`)
  });

  const subject = `Nouveau produit dans la catégorie ${category}`;
  const content = `
    <h1>Nouveau Produit dans la Catégorie ${category}</h1>
    <p>Un nouveau produit a été ajouté dans la catégorie <strong>${category}</strong>.</p>
  `;
  const html = createTemplate(subject, content);

  await notifyUsers(alerts, subject, html);
}

module.exports = {
  notifyRestock,
  notifyPriceChange,
  notifyNewProduct
};
