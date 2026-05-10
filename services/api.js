import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// get access token using client credentials flow
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

// search by keyword and type (artist, track, album)
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

// get details for a single item by spotify id
// example: getById('3TVXtAsR1Inumwj472S9r4', 'artist')
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
