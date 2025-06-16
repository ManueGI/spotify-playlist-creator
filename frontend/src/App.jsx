// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Callback from "./Callback";
import Dashboard from "./pages/Dashboard";
import { getAuthUrl } from "./auth";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("spotify_access_token");
    if (t) setToken(t);
  }, []);

  const handleLogin = async () => {
    window.location.href = await getAuthUrl();
  };

  return (
    <div>
      <h1>🎵 Générateur de playlist sur Spotify🎵</h1>

      {!token && (
        <button onClick={handleLogin}>Se connecter avec Spotify</button>
      )}

      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <p>Bienvenue ! Cliquez sur "Accéder au générateur" pour créer votre playlist.</p>
            ) : (
              <p>Bienvenue ! Connectez-vous pour accéder au dashboard.</p>
            )
          }
        />
        <Route path="/callback" element={<Callback setToken={setToken} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
