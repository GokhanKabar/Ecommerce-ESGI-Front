const express = require("express");
const { indexRouter } = require("./routes/index.js");
const userRoute  = require("./routes/userRoutes.js");
const cors =require("cors");
const app = express();
const db = require("./models");
app.use(cors({
  origin: 'http://localhost:5173', // Autoriser les requêtes depuis votre domaine
  credentials: true,
}));
app.use("/", indexRouter);
app.use(userRoute);

// Syncing our database

db.sequelize.sync().then(() => {
  app.listen(8000, "0.0.0.0", () => {
    console.log("Server listening on http://localhost:8000");
  });
});

