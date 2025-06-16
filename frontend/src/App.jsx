// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Callback from "./Callback";
import Dashboard from "./pages/Dashboard";
import { getAuthUrl } from "./auth";

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const t = localStorage.getItem("spotify_access_token");
    if (t) setToken(t);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && token && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [token, loading, location, navigate]);

  const handleLogin = async () => {
    window.location.href = await getAuthUrl();
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h1 className="site-title">🎵 Générateur de playlist sur Spotify🎵</h1>
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <h2>Bienvenue sur le générateur de playlist !</h2>
              <p>
                Connectez-vous pour commencer à créer vos playlists à partir de vos données.
              </p>
              {!token && (
                <button className="primary-button" onClick={handleLogin}>Se connecter avec Spotify</button>
              )}
            </div>
          }
        />
        <Route path="/callback" element={<Callback setToken={setToken} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
