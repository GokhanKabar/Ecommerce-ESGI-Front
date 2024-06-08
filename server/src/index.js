const productsRoutes = require("./routes/products.route.js");
const brandsRoutes = require("./routes/brands.route.js");
const familiesRoutes = require("./routes/families.route.js");
const express = require("express");
const { indexRouter } = require("./routes/index.js");
const userRoute = require("./routes/userRoutes.js");
const cors = require("cors");
const app = express();
const db = require("./databases/sequelize/models");
const path = require('path');  // Assurez-vous d'importer le module 'path'


app.use(
  cors({
    origin: "http://localhost:5173", // Autoriser les requêtes depuis votre domaine
    credentials: true,
  })
);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use("/", indexRouter);
app.use(userRoute);
app.use(productsRoutes);
app.use(brandsRoutes);
app.use(familiesRoutes);


// Syncing our database

db.sequelize.sync().then(() => {
  app.listen(8000, "0.0.0.0", () => {
    console.log("Server listening on http://localhost:8000");
  });
});
