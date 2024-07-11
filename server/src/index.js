const express = require("express");
const cors = require("cors");
const path = require("path");
const productsRoutes = require("./routes/products.route.js");
const brandsRoutes = require("./routes/brands.route.js");
const familiesRoutes = require("./routes/families.route.js");
const { indexRouter } = require("./routes/index.js");
const userRoute = require("./routes/userRoutes.js");
const db = require("./databases/sequelize/models");
const connectDB = require("./databases/mongoose/mongo.connection.js"); // Importez le fichier de connexion MongoDB
const stripeRoutes = require("./routes/stripe.route.js");

const app = express();

// Configuration de CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Configuration des routes
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/", indexRouter);
app.use(userRoute);
app.use(productsRoutes);
app.use(brandsRoutes);
app.use(familiesRoutes);
app.use("/stripe", stripeRoutes);

// Connexion à MongoDB
connectDB();

// Synchronisation de la base de données MySQL
db.sequelize.sync().then(() => {
  app.listen(8000, "0.0.0.0", () => {
    console.log("Server listening on http://localhost:8000");
  });
});
