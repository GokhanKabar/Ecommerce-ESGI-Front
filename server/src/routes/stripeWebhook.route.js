const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require("../databases/mongoose/Products"); // MongoDB Product Model
const SequelizeProduct = require("../databases/sequelize/models").Product; // Sequelize Product Model
const { sequelize } = require("../databases/sequelize/models"); // Sequelize instance
const OrderController = require("../controllers/order.controller");
const SequelizeOrder = require("../databases/sequelize/models").Order;

router.post(
  "/webhook",
  express.json(), // Remplace express.raw par express.json
  async (req, res) => {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Checkout session completed:", session);
      try {
        const order = await OrderController.createOrder(session);
        SequelizeOrder.update(
          {
            payment_status: "Payed",
            payment_intent_id: session.payment_intent,
          },
          { where: { id: order } }
        );

        const t = await sequelize.transaction();
        const items = JSON.parse(session.metadata.items);

        for (const item of items) {
          const productId = item.productId;
          const quantity = item.quantity;
          const sequelizeProduct = await SequelizeProduct.findByPk(productId, {
            transaction: t,
          });

          if (sequelizeProduct) {
            if (sequelizeProduct.stock >= quantity) {
              sequelizeProduct.stock = sequelizeProduct.stock - quantity;
              await sequelizeProduct.save({ transaction: t });
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

          const product = await Product.findOne({ sequelizeId: productId });
          if (product) {
            if (product.stock >= quantity) {
              product.stock -= quantity;
              await product.save();
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
