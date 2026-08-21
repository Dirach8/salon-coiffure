const express = require("express");

const app = express();

const PORT = 5000;

// Permet à Express de comprendre les données JSON
app.use(express.json());

// Première route de notre API
app.get("/", (req, res) => {
  res.json({
    message: "API du salon de coiffure fonctionne !"
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});