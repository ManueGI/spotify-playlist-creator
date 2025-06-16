import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "../App.css";

export default function Dashboard() {
  const [jsonInput, setJsonInput] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleCreatePlaylist = async () => {
    setError("");
    setPlaylistUrl("");

    if (!playlistName.trim()) {
      setError("Le nom de la playlist est obligatoire.");
      return;
    }

    setLoading(true);

    let songs;
    try {
      songs = JSON.parse(jsonInput);
      if (!Array.isArray(songs))
        throw new Error("Le JSON doit être un tableau.");
    } catch (e) {
      setError("JSON invalide : " + e.message);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
      setError("Token Spotify manquant.");
      setLoading(false);
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${apiBase}/api/create_playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          songs,
          name: playlistName,
          description: playlistDesc,
        }),
      });
      const data = await res.json();
      if (data.playlistUrl) {
        setPlaylistUrl(data.playlistUrl);
      } else {
        setError(data.error || "Erreur inconnue");
      }
    } catch (e) {
      setError("Erreur lors de la création : " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="dashboard-card">
        <h2>Créer une playlist Spotify à partir d’un JSON</h2>
        <label className="dashboard-label">
          Nom de la playlist :
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Nom de la playlist"
            className={`dashboard-input${
              error && !playlistName ? " error" : ""
            }`}
          />
        </label>
        <label className="dashboard-label">
          Description :
          <input
            type="text"
            value={playlistDesc}
            onChange={(e) => setPlaylistDesc(e.target.value)}
            placeholder="Description (optionnel)"
            className="dashboard-input"
          />
        </label>
        <label className="dashboard-label">
          JSON des chansons :
          <textarea
            rows={8}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[{"title":"Imagine","artiste":"John Lennon"}, ...]'
            className="dashboard-textarea"
          />
        </label>
        <button
          onClick={handleCreatePlaylist}
          disabled={loading}
          className="primary-button"
        >
          {loading ? "Création en cours..." : "Créer la playlist Spotify"}
        </button>
        {playlistUrl && (
          <div className="dashboard-success">
            ✅ Playlist créée :{" "}
            <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
              {playlistUrl}
            </a>
          </div>
        )}
        {error && <div className="dashboard-error">{error}</div>}
      </div>
    </div>
  );
}
