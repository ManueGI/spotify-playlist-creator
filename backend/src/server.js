// backend/server.js
// import express from "express";
// import cors from "cors";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { generatePlaylist } = require('./functions/generatePlaylist');

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:5173/callback";

app.get("/api/spotify_client_id", (req, res) => {
  res.json({ clientId: process.env.SPOTIFY_CLIENT_ID });
});

app.post("/api/exchange_token", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await axios.post("https://accounts.spotify.com/api/token", params, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.json(response.data); // { access_token, token_type, expires_in, refresh_token, scope }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
});

app.post('/api/create_playlist', async (req, res) => {
  const { token, songs, name, description } = req.body;
  if (!token || !Array.isArray(songs)) {
    return res.status(400).json({ error: 'Token ou chansons manquants' });
  }

  try {
    const playlistUrl = await generatePlaylist(token, songs, name, description);
    res.json({ playlistUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => {
  res.send('Backend fonctionne');
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
