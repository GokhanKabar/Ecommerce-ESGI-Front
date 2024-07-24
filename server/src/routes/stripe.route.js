const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session/:id", async (req, res) => {
  console.log(req.params);
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://parfums-esgi.store/success",
      cancel_url: "http://parfums-esgi.store/cancel",
      metadata: {
        userId: req.params.id,
        name: req.body.firstName + " " + req.body.lastName,
        address: req.body.address,
        total: items.reduce(
          (acc, item) => acc + item.amount * item.quantity,
          0
        ),
        items: JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        ),
      },
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/checkout-session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (error) {
    console.error("Failed to retrieve checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/refund", async (req, res) => {
  const { payment_intent_id } = req.body;

  try {
    const refund = await stripe.refunds.create({
      payment_intent: payment_intent_id,
    });

    res.json(refund);
  } catch (error) {
    console.error("Failed to process refund:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
