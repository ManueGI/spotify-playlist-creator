// frontend/src/Dashboard.jsx
import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [jsonInput, setJsonInput] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playlistName, setPlaylistName] = useState('Playlist générée');
  const [playlistDesc, setPlaylistDesc] = useState('Créée automatiquement');

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    console.log('🎉 Access token :', token);
    // Ici, vous pourrez bientôt appeler l’API Spotify avec ce token
  }, []);

  const handleCreatePlaylist = async () => {
    setError('');
    setPlaylistUrl('');
    setLoading(true);

    let songs;
    try {
      songs = JSON.parse(jsonInput);
      if (!Array.isArray(songs)) throw new Error('Le JSON doit être un tableau.');
    } catch (e) {
      setError('JSON invalide : ' + e.message);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      setError('Token Spotify manquant.');
      setLoading(false);
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${apiBase}/api/create_playlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, songs, name: playlistName, description: playlistDesc })
      });
      const data = await res.json();
      if (data.playlistUrl) {
        setPlaylistUrl(data.playlistUrl);
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (e) {
      setError('Erreur lors de la création : ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Créer une playlist Spotify à partir d’un JSON</h2>
      <label>
        Nom de la playlist :
        <input
          type="text"
          value={playlistName}
          onChange={e => setPlaylistName(e.target.value)}
          style={{ marginLeft: 8, width: 300 }}
        />
      </label>
      <br />
      <label>
        Description :
        <input
          type="text"
          value={playlistDesc}
          onChange={e => setPlaylistDesc(e.target.value)}
          style={{ marginLeft: 8, width: 300 }}
        />
      </label>
      <br /><br />
      <p>
        Colle ici ton JSON de chansons (exemple :{" "}
        <code>[&#123;&#34;title&#34;:&#34;Imagine&#34;,&#34;artiste&#34;:&#34;John Lennon&#34;&#125;]</code>)
      </p>
      <textarea
        rows={10}
        cols={60}
        value={jsonInput}
        onChange={e => setJsonInput(e.target.value)}
        placeholder='[{"title":"Imagine","artiste":"John Lennon"}, ...]'
      />
      <br />
      <button onClick={handleCreatePlaylist} disabled={loading}>
        {loading ? 'Création en cours...' : 'Créer la playlist Spotify'}
      </button>
      {playlistUrl && (
        <div>
          <p>✅ Playlist créée : <a href={playlistUrl} target="_blank" rel="noopener noreferrer">{playlistUrl}</a></p>
        </div>
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
