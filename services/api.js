import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const getToken = async () => {
  try {
    const response = await axios.post(
      SPOTIFY_ACCOUNTS_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error.message);
    throw error;
  }
};

const searchSpotify = async (keyword, type) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: keyword,
        type,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error searching Spotify for "${keyword}":`, error.message);
    throw error;
  }
};

const getById = async (id, type) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${SPOTIFY_API_URL}/${type}s/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ID "${id}":`, error.message);
    throw error;
  }
};

export { getToken, searchSpotify, getById };
