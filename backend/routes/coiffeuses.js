import express from "express";
import connection from "../config/database.js";

const router = express.Router();

// ========================================
// RÉCUPÉRER TOUTES LES COIFFEUSES
// ========================================

router.get("/", (req, res) => {
  const sql = "SELECT * FROM coiffeuse ORDER BY id DESC";

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("❌ Erreur MySQL :", error.message);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des coiffeuses",
      });
    }

    res.json({
      success: true,
      coiffeuses: results,
    });
  });
});


// ========================================
// AJOUTER UNE COIFFEUSE
// ========================================

router.post("/", (req, res) => {
  const {
    nom,
    prenom,
    telephone,
    email,
    specialite,
    disponibilite,
  } = req.body;

  if (!nom || !prenom) {
    return res.status(400).json({
      success: false,
      message: "Le nom et le prénom sont obligatoires",
    });
  }

  const sql = `
    INSERT INTO coiffeuse
    (nom, prenom, telephone, email, specialite, disponibilite)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const disponibiliteFinale =
    disponibilite || "DISPONIBLE";

  connection.query(
    sql,
    [
      nom,
      prenom,
      telephone || null,
      email || null,
      specialite || null,
      disponibiliteFinale,
    ],
    (error, result) => {
      if (error) {
        console.error("❌ Erreur MySQL :", error.message);

        return res.status(500).json({
          success: false,
          message: "Erreur lors de l'ajout de la coiffeuse",
        });
      }

      res.status(201).json({
        success: true,
        message: "Coiffeuse ajoutée avec succès",
        coiffeuse: {
          id: result.insertId,
          nom,
          prenom,
          telephone: telephone || null,
          email: email || null,
          specialite: specialite || null,
          disponibilite: disponibiliteFinale,
        },
      });
    }
  );
});


// ========================================
// MODIFIER UNE COIFFEUSE
// ========================================

router.put("/:id", (req, res) => {
  const { id } = req.params;

  const {
    nom,
    prenom,
    telephone,
    email,
    specialite,
    disponibilite,
  } = req.body;

  if (!nom || !prenom) {
    return res.status(400).json({
      success: false,
      message: "Le nom et le prénom sont obligatoires",
    });
  }

  const sql = `
    UPDATE coiffeuse
    SET
      nom = ?,
      prenom = ?,
      telephone = ?,
      email = ?,
      specialite = ?,
      disponibilite = ?
    WHERE id = ?
  `;

  connection.query(
    sql,
    [
      nom,
      prenom,
      telephone || null,
      email || null,
      specialite || null,
      disponibilite || "DISPONIBLE",
      id,
    ],
    (error, result) => {
      if (error) {
        console.error("❌ Erreur MySQL :", error.message);

        return res.status(500).json({
          success: false,
          message: "Erreur lors de la modification de la coiffeuse",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Coiffeuse introuvable",
        });
      }

      res.json({
        success: true,
        message: "Coiffeuse modifiée avec succès",
        coiffeuse: {
          id: Number(id),
          nom,
          prenom,
          telephone: telephone || null,
          email: email || null,
          specialite: specialite || null,
          disponibilite: disponibilite || "DISPONIBLE",
        },
      });
    }
  );
});


// ========================================
// SUPPRIMER UNE COIFFEUSE
// ========================================

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM coiffeuse WHERE id = ?";

  connection.query(sql, [id], (error, result) => {
    if (error) {
      console.error("❌ Erreur MySQL :", error.message);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de la coiffeuse",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Coiffeuse introuvable",
      });
    }

    res.json({
      success: true,
      message: "Coiffeuse supprimée avec succès",
    });
  });
});

export default router;