import { useEffect, useState } from "react";
import "./coiffeuses.css";

function Coiffeuses() {
  const [coiffeuses, setCoiffeuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
const [saving, setSaving] = useState(false);
const [coiffeuseModifiee, setCoiffeuseModifiee] = useState(null);
const [coiffeuseASupprimer, setCoiffeuseASupprimer] = useState(null);
const [deleting, setDeleting] = useState(false);

const [formData, setFormData] = useState({
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  specialite: "",
  disponibilite: "DISPONIBLE",
});

const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  };

  const modifierCoiffeuse = async (e) => {
    e.preventDefault();
  
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      alert("Le nom et le prénom sont obligatoires.");
      return;
    }
  
    try {
      setSaving(true);
  
      const response = await fetch(
        `http://localhost:5000/api/coiffeuses/${coiffeuseModifiee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la modification"
        );
      }
  
      setCoiffeuses((ancien) =>
        ancien.map((coiffeuse) =>
          coiffeuse.id === coiffeuseModifiee.id
            ? {
                ...coiffeuse,
                ...formData,
              }
            : coiffeuse
        )
      );
  
      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        specialite: "",
        disponibilite: "DISPONIBLE",
      });
  
      setCoiffeuseModifiee(null);
      setShowModal(false);
  
    } catch (error) {
      console.error("Erreur :", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const ouvrirModification = (coiffeuse) => {
    setCoiffeuseModifiee(coiffeuse);
  
    setFormData({
      nom: coiffeuse.nom || "",
      prenom: coiffeuse.prenom || "",
      telephone: coiffeuse.telephone || "",
      email: coiffeuse.email || "",
      specialite: coiffeuse.specialite || "",
      disponibilite: coiffeuse.disponibilite || "DISPONIBLE",
    });
    
      
        setShowModal(true);
      };

      const supprimerCoiffeuse = async () => {
        if (!coiffeuseASupprimer) {
          return;
        }
      
        try {
          setDeleting(true);
      
          const response = await fetch(
            `http://localhost:5000/api/coiffeuses/${coiffeuseASupprimer.id}`,
            {
              method: "DELETE",
            }
          );
      
          const data = await response.json();
      
          if (!response.ok) {
            throw new Error(
              data.message || "Erreur lors de la suppression"
            );
          }
      
          setCoiffeuses((ancien) =>
            ancien.filter(
              (coiffeuse) =>
                coiffeuse.id !== coiffeuseASupprimer.id
            )
          );
      
          setCoiffeuseASupprimer(null);
      
        } catch (error) {
          console.error("Erreur :", error);
          alert(error.message);
        } finally {
          setDeleting(false);
        }
      };

const ajouterCoiffeuse = async (e) => {
    e.preventDefault();
  
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      alert("Le nom et le prénom sont obligatoires.");
      return;
    }
  
    try {
      setSaving(true);
  
      const response = await fetch(
        "http://localhost:5000/api/coiffeuses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de l'ajout"
        );
      }
  
      setCoiffeuses((ancien) => [
        data.coiffeuse,
        ...ancien,
      ]);
  
      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        specialite: "",
        disponibilite: "DISPONIBLE",
      });
  
      setShowModal(false);
  
    } catch (error) {
      console.error("Erreur :", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    let actif = true;

    const chargerCoiffeuses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/coiffeuses"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Erreur lors du chargement"
          );
        }

        if (actif) {
          setCoiffeuses(data.coiffeuses);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur :", error);

        if (actif) {
          setError(
            "Impossible de charger les coiffeuses."
          );
          setLoading(false);
        }
      }
    };

    chargerCoiffeuses();

    return () => {
      actif = false;
    };
  }, []);

  return (
    <div className="coiffeuses-page">

      {/* EN-TÊTE */}

      <div className="coiffeuses-header">

        <div>
          <h2>Gestion des coiffeuses</h2>

          <p>
            Gérez les coiffeuses enregistrées dans votre salon.
          </p>
        </div>

        <button
  className="add-coiffeuse-button"
  onClick={() => setShowModal(true)}
>
  + Ajouter une coiffeuse
</button>

      </div>


      {/* STATISTIQUE */}

      <div className="coiffeuse-summary">

        <div className="summary-icon">
          💇‍♀️
        </div>

        <div>
          <span>Total des coiffeuses</span>

          <strong>
            {coiffeuses.length}
          </strong>
        </div>

      </div>


      {/* RECHERCHE */}

      <div className="coiffeuses-toolbar">

        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Rechercher une coiffeuse..."
          />

        </div>

      </div>


      {/* CONTENU */}

      <div className="coiffeuses-card">

        {loading && (
          <div className="coiffeuses-message">
            Chargement des coiffeuses...
          </div>
        )}

        {error && (
          <div className="coiffeuses-message error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          coiffeuses.length === 0 && (
            <div className="coiffeuses-message">
              Aucune coiffeuse enregistrée.
            </div>
          )}

        {!loading &&
          !error &&
          coiffeuses.length > 0 && (

            <div className="coiffeuses-table-wrapper">

              <table className="coiffeuses-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Coiffeuse</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Spécialité</th>
                    <th>Disponibilité</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {coiffeuses.map((coiffeuse) => (

                    <tr key={coiffeuse.id}>

                      <td>
                        #{coiffeuse.id}
                      </td>

                      <td>

                        <div className="coiffeuse-name">

                          <div className="coiffeuse-avatar">
                            {coiffeuse.prenom.charAt(0)}
                            {coiffeuse.nom.charAt(0)}
                          </div>

                          <div>

                            <strong>
                              {coiffeuse.prenom}{" "}
                              {coiffeuse.nom}
                            </strong>

                            <span>
                              Coiffeuse
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {coiffeuse.telephone || "—"}
                      </td>

                      <td>
                        {coiffeuse.email || "—"}
                      </td>

                      <td>
                        {coiffeuse.specialite || "—"}
                      </td>

                      <td>

                        <span
                          className={`availability-badge ${
                            coiffeuse.disponibilite ===
                            "DISPONIBLE"
                              ? "available"
                              : "unavailable"
                          }`}
                        >
                          <span className="status-dot"></span>

                          {coiffeuse.disponibilite ===
                          "DISPONIBLE"
                            ? "Disponible"
                            : "Indisponible"}
                        </span>

                      </td>

                      <td>

                        <div className="coiffeuse-actions">

                        <button
  className="action-button edit"
  title="Modifier"
  onClick={() => ouvrirModification(coiffeuse)}
>
  ✏️
</button>

<button
  className="action-button delete"
  title="Supprimer"
  onClick={() => setCoiffeuseASupprimer(coiffeuse)}
>
  🗑️
</button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

      </div>

      {showModal && (
  <div className="modal-overlay">

    <div className="coiffeuse-modal">

      <div className="modal-header">

        <div>
        <h3>
  {coiffeuseModifiee
    ? "Modifier une coiffeuse"
    : "Ajouter une coiffeuse"}
</h3>

<p>
  {coiffeuseModifiee
    ? "Modifiez les informations de cette coiffeuse."
    : "Ajoutez une nouvelle coiffeuse au salon."}
</p>
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={() => {
            setShowModal(false);
            setCoiffeuseModifiee(null);
          }}
        >
          ×
        </button>

      </div>

      <form
  className="coiffeuse-form"
  onSubmit={
    coiffeuseModifiee
      ? modifierCoiffeuse
      : ajouterCoiffeuse
  }
>

        <div className="form-row">

          <div className="form-group">
            <label>Prénom *</label>

            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Ex : Fatou"
            />
          </div>

          <div className="form-group">
            <label>Nom *</label>

            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex : Kaboré"
            />
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Téléphone</label>

            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Ex : 70000000"
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex : fatou@email.com"
            />
          </div>

        </div>

        <div className="form-group">
          <label>Spécialité</label>

          <input
            type="text"
            name="specialite"
            value={formData.specialite}
            onChange={handleChange}
            placeholder="Ex : Coiffure féminine"
          />
        </div>

        <div className="form-group">
          <label>Disponibilité</label>

          <select
            name="disponibilite"
            value={formData.disponibilite}
            onChange={handleChange}
          >
            <option value="DISPONIBLE">
              Disponible
            </option>

            <option value="INDISPONIBLE">
              Indisponible
            </option>
          </select>
        </div>

        <div className="modal-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() => {
                setShowModal(false);
                setCoiffeuseModifiee(null);
              }}
          >
            Annuler
          </button>

          <button
            type="submit"
            className="submit-button"
            disabled={saving}
          >
           {saving
  ? "Enregistrement..."
  : coiffeuseModifiee
    ? "Enregistrer les modifications"
    : "Ajouter la coiffeuse"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}

{coiffeuseASupprimer && (
  <div className="modal-overlay">

    <div className="delete-modal">

      <div className="delete-icon">
        🗑️
      </div>

      <h3>
        Supprimer la coiffeuse ?
      </h3>

      <p>
        Êtes-vous sûr de vouloir supprimer{" "}
        <strong>
          {coiffeuseASupprimer.prenom}{" "}
          {coiffeuseASupprimer.nom}
        </strong>{" "}
        ?
      </p>

      <span className="delete-warning">
        Cette action est irréversible.
      </span>

      <div className="delete-actions">

        <button
          type="button"
          className="cancel-button"
          onClick={() =>
            setCoiffeuseASupprimer(null)
          }
          disabled={deleting}
        >
          Annuler
        </button>

        <button
          type="button"
          className="confirm-delete-button"
          onClick={supprimerCoiffeuse}
          disabled={deleting}
        >
          {deleting
            ? "Suppression..."
            : "Supprimer"}
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}

export default Coiffeuses;