import { useEffect, useState } from "react";
import "./clients.css";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [clientAModifier, setClientAModifier] = useState(null);
  const [clientASupprimer, setClientASupprimer] = useState(null);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: "",
  });

  const [formError, setFormError] = useState("");
  const [adding, setAdding] = useState(false);

  // ================================
  // CHARGER LES CLIENTS
  // ================================

  useEffect(() => {
    let actif = true;

    const chargerClients = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/clients"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Erreur lors du chargement"
          );
        }

        if (actif) {
          setClients(data.clients);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur :", error);

        if (actif) {
          setError("Impossible de charger les clients.");
          setLoading(false);
        }
      }
    };

    chargerClients();

    return () => {
      actif = false;
    };
  }, []);

  // ================================
  // MODIFICATION DU FORMULAIRE
  // ================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  };

  

  // ================================
  // AJOUTER UN CLIENT
  // ================================
  const ouvrirModification = (client) => {
    setClientAModifier(client);
  
    setFormData({
      nom: client.nom || "",
      prenom: client.prenom || "",
      telephone: client.telephone || "",
      email: client.email || "",
      adresse: client.adresse || "",
    });
  
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setFormError("");

  if (!formData.nom.trim()) {
    setFormError("Veuillez saisir le nom du client.");
    return;
  }

  if (!formData.prenom.trim()) {
    setFormError("Veuillez saisir le prénom du client.");
    return;
  }

  try {
    setAdding(true);

    const url = clientAModifier
      ? `http://localhost:5000/api/clients/${clientAModifier.id}`
      : "http://localhost:5000/api/clients";

    const response = await fetch(url, {
      method: clientAModifier ? "PUT" : "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Une erreur est survenue."
      );
    }

    if (clientAModifier) {

      // Modification du client dans le tableau
      setClients((anciens) =>
        anciens.map((client) =>
          client.id === clientAModifier.id
            ? data.client
            : client
        )
      );

    } else {

      // Ajout d'un nouveau client
      setClients((anciens) => [
        ...anciens,
        data.client,
      ]);

    }

    fermerModal();

  } catch (error) {
    console.error("Erreur :", error);

    setFormError(
      error.message || "Une erreur est survenue."
    );

  } finally {
    setAdding(false);
  }
};

  // ================================
  // ANNULER
  // ================================

  const supprimerClient = async () => {
    if (!clientASupprimer) {
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${clientASupprimer.id}`,
        {
          method: "DELETE",
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de supprimer le client."
        );
      }
  
      setClients((anciens) =>
        anciens.filter(
          (client) => client.id !== clientASupprimer.id
        )
      );
  
      setClientASupprimer(null);
  
    } catch (error) {
      console.error("Erreur :", error);
  
      alert(
        error.message || "Impossible de supprimer le client."
      );
    }
  };



  const fermerModal = () => {
    setShowModal(false);
  
    setClientAModifier(null);
  
    setFormError("");
  
    setFormData({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      adresse: "",
    });
  };

  return (
    <div className="clients-page">

      {/* ================================
          HEADER
      ================================= */}

      <div className="clients-header">

        <div>
          <h2>Gestion des clients</h2>

          <p>
            Gérez les clients enregistrés dans votre salon.
          </p>
        </div>

        <button
          className="add-client-button"
          onClick={() => setShowModal(true)}
        >
          + Ajouter un client
        </button>

      </div>


      {/* ================================
          STATISTIQUE
      ================================= */}

      <div className="client-summary">

        <div className="summary-icon">
          👥
        </div>

        <div>
          <span>Total des clients</span>

          <strong>
            {loading ? "..." : clients.length}
          </strong>
        </div>

      </div>


      {/* ================================
          RECHERCHE
      ================================= */}

      <div className="clients-toolbar">

        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Rechercher un client..."
          />

        </div>

      </div>


      {/* ================================
          TABLEAU
      ================================= */}

      <div className="clients-card">

        {loading && (
          <div className="clients-message">
            Chargement des clients...
          </div>
        )}

        {error && (
          <div className="clients-message error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          clients.length === 0 && (
            <div className="clients-message">
              Aucun client enregistré.
            </div>
          )}

        {!loading &&
          !error &&
          clients.length > 0 && (

            <div className="clients-table-wrapper">

              <table className="clients-table">

                <thead>
                  <tr>
                    <th>Identifiant</th>
                    <th>Client</th>
                    <th>Téléphone</th>
                    <th>E-mail</th>
                    <th>Adresse</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {clients.map((client) => (

                    <tr key={client.id}>

                      <td>
                        #{client.id}
                      </td>

                      <td>

                        <div className="client-name">

                          <div className="client-avatar">
                            {client.prenom.charAt(0)}
                            {client.nom.charAt(0)}
                          </div>

                          <div>

                            <strong>
                              {client.prenom} {client.nom}
                            </strong>

                            <span>
                              Client
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {client.telephone || "—"}
                      </td>

                      <td>
                        {client.email || "—"}
                      </td>

                      <td>
                        {client.adresse || "—"}
                      </td>

                      <td>

                        <div className="client-actions">

                        <button
  className="action-button edit"
  title="Modifier"
  onClick={() => ouvrirModification(client)}
>
  ✏️
</button>

<button
  className="action-button delete"
  title="Supprimer"
  onClick={() => setClientASupprimer(client)}
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


      {/* ================================
          MODALE AJOUT CLIENT
      ================================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={fermerModal}
        >

          <div
            className="client-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
              <h3>
  {clientAModifier
    ? "Modifier le client"
    : "Ajouter un client"}
</h3>

                <p>
                  Ajoutez les informations du nouveau client.
                </p>
              </div>

              {adding
  ? "Enregistrement..."
  : clientAModifier
    ? "Enregistrer les modifications"
    : "Ajouter le client"}

            </div>


            <form
              className="client-form"
              onSubmit={handleSubmit}
            >

              {formError && (
                <div className="form-error">
                  {formError}
                </div>
              )}


              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="nom">
                    Nom *
                  </label>

                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    placeholder="Ex : Traore"
                    value={formData.nom}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="prenom">
                    Prénom *
                  </label>

                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    placeholder="Ex : Aminata"
                    value={formData.prenom}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="telephone">
                    Téléphone
                  </label>

                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    placeholder="Ex : 70000000"
                    value={formData.telephone}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="email">
                    E-mail
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ex : client@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="form-group">

                <label htmlFor="adresse">
                  Adresse
                </label>

                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  placeholder="Ex : Ouagadougou"
                  value={formData.adresse}
                  onChange={handleChange}
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={fermerModal}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="submit-client-button"
                  disabled={adding}
                >
                  {adding
                    ? "Ajout en cours..."
                    : "Ajouter le client"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

{clientASupprimer && (
  <div
    className="delete-modal-overlay"
    onClick={() => setClientASupprimer(null)}
  >
    <div
      className="delete-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="delete-icon">
        🗑️
      </div>

      <h3>
        Supprimer ce client ?
      </h3>

      <p>
        Voulez-vous vraiment supprimer{" "}
        <strong>
          {clientASupprimer.prenom} {clientASupprimer.nom}
        </strong>
        ?
      </p>

      <span className="delete-warning">
        Cette action est irréversible.
      </span>

      <div className="delete-modal-actions">

        <button
          className="delete-cancel-button"
          onClick={() => setClientASupprimer(null)}
        >
          Annuler
        </button>

        <button
          className="delete-confirm-button"
          onClick={supprimerClient}
        >
          Supprimer
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default Clients;