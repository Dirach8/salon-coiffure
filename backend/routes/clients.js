import express from "express";
import connection from "../config/database.js";

const router = express.Router();

// Récupérer tous les clients
router.get("/", (req, res) => {
  const sql = "SELECT * FROM client ORDER BY id DESC";

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("❌ Erreur MySQL :", error.message);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des clients",
      });
    }

    res.json({
      success: true,
      clients: results,
    });
  });
});

// Ajouter un client
router.post("/", (req, res) => {
    const {
      nom,
      prenom,
      telephone,
      email,
      adresse
    } = req.body;
  
    // Vérifier les champs obligatoires
    if (!nom || !prenom) {
      return res.status(400).json({
        success: false,
        message: "Le nom et le prénom sont obligatoires"
      });
    }
  
    const sql = `
      INSERT INTO client
      (nom, prenom, telephone, email, adresse)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    connection.query(
      sql,
      [nom, prenom, telephone, email, adresse],
      (error, result) => {
  
        if (error) {
          console.error("❌ Erreur MySQL :", error.message);
  
          return res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout du client"
          });
        }
  
        res.status(201).json({
          success: true,
          message: "Client ajouté avec succès",
          client: {
            id: result.insertId,
            nom,
            prenom,
            telephone,
            email,
            adresse
          }
        });
      }
    );
  });

  // Modifier un client
router.put("/:id", (req, res) => {
    const { id } = req.params;
  
    const {
      nom,
      prenom,
      telephone,
      email,
      adresse
    } = req.body;
  
    if (!nom || !prenom) {
      return res.status(400).json({
        success: false,
        message: "Le nom et le prénom sont obligatoires"
      });
    }
  
    const sql = `
      UPDATE client
      SET
        nom = ?,
        prenom = ?,
        telephone = ?,
        email = ?,
        adresse = ?
      WHERE id = ?
    `;
  
    connection.query(
      sql,
      [nom, prenom, telephone, email, adresse, id],
      (error, result) => {
  
        if (error) {
          console.error("❌ Erreur MySQL :", error.message);
  
          return res.status(500).json({
            success: false,
            message: "Erreur lors de la modification du client"
          });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Client introuvable"
          });
        }
  
        res.json({
            success: true,
            message: "Client modifié avec succès",
            client: {
              id: Number(id),
              nom,
              prenom,
              telephone,
              email,
              adresse
            }
          });
      }
    );
  });

  // Supprimer un client
router.delete("/:id", (req, res) => {
    const { id } = req.params;
  
    const sql = "DELETE FROM client WHERE id = ?";
  
    connection.query(sql, [id], (error, result) => {
      if (error) {
        console.error("❌ Erreur MySQL :", error.message);
  
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la suppression du client"
        });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Client introuvable"
        });
      }
  
      res.json({
        success: true,
        message: "Client supprimé avec succès"
      });
    });
  });

export default router;