import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // loads .env into process.env

  

// TODO: get access token from Spotify using client credentials flow
// POST https://accounts.spotify.com/api/token
// Use CLIENT_ID and CLIENT_SECRET from .env
const getToken = async () => {
    try {
    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
            grant_type: "client_credentials",
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        }),
        {
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
        }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching Spotify access token:", error.message);
        throw error;
    }
};

// TODO: search Spotify by keyword and type (artist, track, album)
// GET https://api.spotify.com/v1/search
// Requires Bearer token in Authorization header
const searchSpotify = async (keyword, type) => {
try {
    const token = await getToken();
    const response = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: keyword,
          type: type,
        },
      }
    );
    
    return response.data; 
  } catch (error) {
    console.error(`Error searching Spotify for "${keyword}":`, error.message);
    throw error;
  }
};

// TODO: get detailed data for a single item by its Spotify ID
// e.g. GET https://api.spotify.com/v1/artists/{id}
const getById = async (id, type) => {
    try {
    const token = await getToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/${type}s/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ID "${id}":`, error.message);
    throw error;
  }
};

export { getToken, searchSpotify, getById };
