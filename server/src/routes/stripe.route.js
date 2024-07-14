const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  try {
    // Create Stripe session
    console.log("items", items);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount * 100, // Stripe requires amounts in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        items: JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        ),
      },
    });

    console.log(items);
    console.log("Stripe session created:", session); // Log created session
    res.json({ id: session.id });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
