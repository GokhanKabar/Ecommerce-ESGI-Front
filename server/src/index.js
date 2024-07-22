const express = require("express");
const cors = require("cors");
const path = require("path");
const productsRoutes = require("./routes/products.route.js");
const brandsRoutes = require("./routes/brands.route.js");
const familiesRoutes = require("./routes/families.route.js");
const orderRoutes = require("./routes/order.route.js");
const { indexRouter } = require("./routes/index.js");
const userRoute = require("./routes/userRoutes.js");
const db = require("./databases/sequelize/models");
const connectDB = require("./databases/mongoose/mongo.connection.js"); // Importez le fichier de connexion MongoDB
const stripeRoutes = require("./routes/stripe.route.js");
const stripeWebhook = require("./routes/stripeWebhook.route.js");
const contactRoutes = require("./routes/contact.route.js");
const statisticalRoutes= require("./routes/statistical.route.js")
const alertRoutes = require("./routes/alert.route.js");

const app = express();

// Configuration de CORS
app.use(
  cors({
    origin: "http://sensvinylo.tech",
    credentials: true,
  })
);
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Configuration des routes
app.use("/api/stripe-webhook", stripeWebhook);
app.use("/api/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api", indexRouter);
app.use("/api", userRoute);
app.use("/api", productsRoutes);
app.use("/api", brandsRoutes);
app.use("/api", familiesRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api", orderRoutes);
app.use("/api", orderRoutes);
app.use('/api/contact', contactRoutes);
// Connexion à MongoDB
connectDB();

// Synchronisation de la base de données MySQL
db.sequelize.sync().then(() => {
  app.listen(8000, "0.0.0.0", () => {
    console.log("Server listening on http://localhost:8000");
  });
});
