import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Vérification de l'email
    if (email.trim() === "") {
      setError("Veuillez saisir votre adresse e-mail.");
      return;
    }

    if (!email.includes("@")) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    // Vérification du mot de passe
    if (password.trim() === "") {
      setError("Veuillez saisir votre mot de passe.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    // Simulation d'une connexion réussie
    setSuccess("Connexion réussie !");
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-header">
          <h1>Salon Élégance</h1>
          <p>Gestion du salon de coiffure</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">Adresse e-mail</label>

            <input
              type="email"
              id="email"
              placeholder="Entrez votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>

            <input
              type="password"
              id="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          <div className="forgot-password">
            <a href="#">Mot de passe oublié ?</a>
          </div>

          <button type="submit" className="login-button">
            Se connecter
          </button>

        </form>

        <p className="login-footer">
          © 2026 Salon Élégance
        </p>

      </div>
    </div>
  );
}

export default Login;