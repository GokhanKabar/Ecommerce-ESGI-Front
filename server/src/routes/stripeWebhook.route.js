const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require("../databases/mongoose/Products"); // MongoDB Product Model
const SequelizeProduct = require("../databases/sequelize/models").Product; // Sequelize Product Model
const { sequelize } = require("../databases/sequelize/models"); // Sequelize instance

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("Webhook request received");
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = await stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("Webhook event constructed:", event);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.sendStatus(400);
    }

    console.log("Event type received:", event.type);
    console.log("Event data received:", event.data);
    if (event.type === "checkout.session.completed") {
      console.log("Checkout session completed event received");
      const session = event.data.object;

      try {
        const t = await sequelize.transaction();
        console.log("Processing session:", session);

        const items = JSON.parse(session.metadata.items);

        for (const item of items) {
          const productId = item.productId;
          const quantity = item.quantity;

          console.log(
            `Processing product ID: ${productId} with quantity: ${quantity}`
          );

          // Update Sequelize stock
          const sequelizeProduct = await SequelizeProduct.findByPk(productId, {
            transaction: t,
          });

          if (sequelizeProduct) {
            if (sequelizeProduct.stock >= quantity) {
              sequelizeProduct.stock = sequelizeProduct.stock - quantity;
              await sequelizeProduct.save({ transaction: t });
              console.log(
                `Updated Sequelize stock for product ID: ${productId}`
              );
            } else {
              console.error(
                `Stock insuffisant pour le produit Sequelize: ${productId}`
              );
              throw new Error("Stock insuffisant");
            }
          } else {
            console.error(`Produit Sequelize introuvable: ${productId}`);
            throw new Error("Produit introuvable");
          }

          // Update MongoDB stock
          const product = await Product.findOne({ sequelizeId: productId });
          if (product) {
            if (product.stock >= quantity) {
              product.stock -= quantity;
              await product.save();
              console.log(`Updated MongoDB stock for product ID: ${productId}`);
            } else {
              console.error(
                `Stock insuffisant pour le produit MongoDB: ${productId}`
              );
              throw new Error("Stock insuffisant");
            }
          } else {
            console.error(`Produit MongoDB introuvable: ${productId}`);
            throw new Error("Produit introuvable");
          }
        }

        // Commit the transaction for Sequelize
        await t.commit();
        console.log("Transaction committed");
      } catch (error) {
        console.error("Failed to update product stock:", error);
        await t.rollback();
        return res.sendStatus(400);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
