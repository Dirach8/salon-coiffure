import express from "express";
import bcrypt from "bcrypt";
import connection from "../config/database.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, mot_de_passe } = req.body;

  // Vérifier que les champs sont remplis
  if (!email || !mot_de_passe) {
    return res.status(400).json({
      success: false,
      message: "Email et mot de passe obligatoires"
    });
  }

  // Rechercher l'utilisateur
  const sql = "SELECT * FROM utilisateur WHERE email = ?";

  connection.query(sql, [email], async (error, results) => {
    if (error) {
      console.error("❌ Erreur MySQL :", error.message);

      return res.status(500).json({
        success: false,
        message: "Erreur serveur"
      });
    }

    // Aucun utilisateur trouvé
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    const utilisateur = results[0];

    // Vérifier le mot de passe
    const motDePasseCorrect = await bcrypt.compare(
      mot_de_passe,
      utilisateur.mot_de_passe
    );

    if (!motDePasseCorrect) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Connexion réussie
    res.json({
      success: true,
      message: "Connexion réussie",
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role
      }
    });
  });
});

export default router;