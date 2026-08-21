import express from "express";
import connection from "./config/database.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import clientRoutes from "./routes/clients.js";

const app = express();
app.use(cors());

const PORT = 5000;

app.use(express.json());
app.use("/api/auth", authRoutes
);
app.use("/api/clients", clientRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API du salon de coiffure fonctionne !"
  });
});

app.get("/api/test-db", (req, res) => {
  connection.query("SELECT 1 AS test", (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Erreur de connexion à MySQL"
      });
    }

    res.json({
      success: true,
      message: "Connexion MySQL réussie !",
      result: results
    });
  });
});

// NOUVELLE ROUTE
app.get("/api/utilisateurs", (req, res) => {
  connection.query("SELECT * FROM utilisateur", (error, results) => {
    if (error) {
      console.error("❌ Erreur MySQL :", error.message);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des utilisateurs"
      });
    }

    res.json({
      success: true,
      utilisateurs: results
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});