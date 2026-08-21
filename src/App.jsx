import { useState } from "react";
import Login from "./Pages/Login";
import Dashboard from "./Pages/dashboard";

function App() {
  const [utilisateur, setUtilisateur] = useState(null);

  if (utilisateur) {
    return <Dashboard utilisateur={utilisateur} />;
  }

  return <Login onLogin={setUtilisateur} />;
}

export default App;