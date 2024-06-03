const mongoose = require("mongoose");

export const dbConnection = async () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_HOST}:${process.env.DB_PASSWORD}@atlascluster.uqsopu3.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((e) => console.log("Connexion à MongoDB échouée !", e));
};
