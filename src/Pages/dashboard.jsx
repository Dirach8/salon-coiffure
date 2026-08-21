import { useState } from "react";
import Clients from "./clients";
import "./Dashboard.css";

function Dashboard({ utilisateur }) {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <h2>Salon Élégance</h2>
          <p>Administration</p>
        </div>

        <nav className="sidebar-menu">

          <button
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            🏠 Tableau de bord
          </button>

          <button
            className={page === "clients" ? "active" : ""}
            onClick={() => setPage("clients")}
          >
            👥 Clients
          </button>

          <button>
            💇‍♀️ Coiffeuses
          </button>

          <button>
            ✂️ Prestations
          </button>

          <button>
            📅 Rendez-vous
          </button>

          <button>
            💳 Paiements
          </button>

          <button>
            🚪 Déconnexion
          </button>

        </nav>

      </aside>


      {/* CONTENU PRINCIPAL */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <h1>
            {page === "dashboard"
              ? "Tableau de bord"
              : "Gestion des clients"}
          </h1>

          <div className="user-info">

            <div className="user-avatar">
              {utilisateur.prenom.charAt(0)}
            </div>

            <div className="user-details">

              <span className="user-name">
                {utilisateur.prenom} {utilisateur.nom}
              </span>

              <span className="user-role">
                {utilisateur.role}
              </span>

            </div>

          </div>

        </header>


        {/* CONTENU */}

        <section className="dashboard-content">

          {/* DASHBOARD */}

          {page === "dashboard" && (
            <>
              <div className="welcome-section">

                <h2>
                  Bonjour {utilisateur.prenom} 👋
                </h2>

                <p>
                  Voici un aperçu de votre salon de coiffure.
                </p>

              </div>

              <div className="stats-grid">

                <div className="stat-card">
                  <h3>Clients</h3>
                  <div className="stat-number">0</div>
                </div>

                <div className="stat-card">
                  <h3>Coiffeuses</h3>
                  <div className="stat-number">0</div>
                </div>

                <div className="stat-card">
                  <h3>Rendez-vous</h3>
                  <div className="stat-number">0</div>
                </div>

                <div className="stat-card">
                  <h3>Paiements</h3>
                  <div className="stat-number">0 F</div>
                </div>

              </div>
            </>
          )}


          {/* CLIENTS */}

          {page === "clients" && <Clients />}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;