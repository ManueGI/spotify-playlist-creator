const clientId = "non utilisé dans frontend"; // Pas besoin si backend gère
const redirectUri = "http://127.0.0.1:5173/callback";

const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
  "user-read-email",
];

let cachedClientId = null;

async function fetchClientId() {
  if (cachedClientId) return cachedClientId;
   const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/spotify_client_id`);
  const data = await res.json();
  cachedClientId = data.clientId;
  return cachedClientId;
}

export const getAuthUrl = async () => {
  const clientId = await fetchClientId();
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI; // Ne pas encoder cette URL

  const scopeParam = encodeURIComponent(scopes.join(" "));
  const authEndpoint = "https://accounts.spotify.com/authorize";
  return `${authEndpoint}?client_id=${clientId}`
    + `&redirect_uri=${redirectUri}` // Utilisez l'URL sans l'encoder
    + `&scope=${scopeParam}`
    + `&response_type=code`
    + `&show_dialog=true`;
};
