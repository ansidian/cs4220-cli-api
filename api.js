import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // loads .env into process.env

export { getToken, searchSpotify, getById };

// TODO: get access token from Spotify using client credentials flow
// POST https://accounts.spotify.com/api/token
// Use CLIENT_ID and CLIENT_SECRET from .env
const getToken = async () => {};

// TODO: search Spotify by keyword and type (artist, track, album)
// GET https://api.spotify.com/v1/search
// Requires Bearer token in Authorization header
const searchSpotify = async (keyword, type) => {};

// TODO: get detailed data for a single item by its Spotify ID
// e.g. GET https://api.spotify.com/v1/artists/{id}
const getById = async (id, type) => {};
