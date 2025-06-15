const axios = require('axios');

async function generatePlaylist(token, songs, name = 'Playlist générée', description = 'Créée automatiquement') {
  // 1. Récupérer l'ID utilisateur
  const userRes = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const userId = userRes.data.id;

  // 2. Créer la playlist
  const playlistRes = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name,
      description,
      public: false
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const playlistId = playlistRes.data.id;

  // 3. Chercher les URI des chansons
  const uris = [];
  for (const song of songs) {
    const q = encodeURIComponent(`${song.title} ${song.artiste}`);
    const searchRes = await axios.get(
      `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const track = searchRes.data.tracks.items[0];
    if (track) uris.push(track.uri);
  }

  if (uris.length === 0) {
    throw new Error('Aucune chanson trouvée sur Spotify.');
  }

  // 4. Ajouter les chansons à la playlist
  await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    { uris },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return `https://open.spotify.com/playlist/${playlistId}`;
}

module.exports = { generatePlaylist };
