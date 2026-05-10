import express from "express";

import { getById, searchSpotify } from "../services/api.js";
import db from "../services/db.js";

const router = express.Router();
const SEARCH_COLLECTION = "SearchHistoryKeyword";
const SELECTION_COLLECTION = "SelectionHistory";
const VALID_TYPES = new Set(["artist", "track", "album"]);

const cleanType = (value) => {
  const type = typeof value === "string" ? value : "artist";
  return VALID_TYPES.has(type) ? type : null;
};

const cleanKeyword = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const makeDisplay = (item, type) => {
  if (type === "track") {
    const artist = item.artists?.[0]?.name;
    const album = item.album?.name;
    return [item.name, artist, album].filter(Boolean).join(" - ");
  }

  if (type === "album") {
    const artist = item.artists?.[0]?.name;
    return [item.name, artist].filter(Boolean).join(" - ");
  }

  return item.name;
};

const saveUniqueKeyword = async (keyword, type) => {
  const normalizedKeyword = keyword.toLowerCase();
  const existing = await db.find(SEARCH_COLLECTION, { normalizedKeyword });
  const alreadySaved = existing && (await existing.hasNext());

  if (alreadySaved) {
    return;
  }

  await db.insert(SEARCH_COLLECTION, {
    keyword,
    normalizedKeyword,
    type,
    searchedAt: new Date().toISOString(),
  });
};

const saveSelection = async (details, type) => {
  await db.insert(SELECTION_COLLECTION, {
    identifier: details.id,
    type,
    display: makeDisplay(details, type),
    selectedAt: new Date().toISOString(),
  });
};

router.get("/", async (req, res) => {
  const keyword = cleanKeyword(req.query.keyword);
  const type = cleanType(req.query.type);

  if (!keyword) {
    return res.status(400).json({ error: "keyword query parameter is required" });
  }

  if (!type) {
    return res.status(400).json({ error: "type must be artist, track, or album" });
  }

  try {
    const results = await searchSpotify(keyword, type);
    const items = results[`${type}s`]?.items || [];

    await saveUniqueKeyword(keyword, type);

    return res.json(items.map((item) => ({
      display: makeDisplay(item, type),
      identifier: item.id,
    })));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to search Spotify" });
  }
});

router.get("/:id", async (req, res) => {
  const type = cleanType(req.query.type);

  if (!type) {
    return res.status(400).json({ error: "type must be artist, track, or album" });
  }

  try {
    const details = await getById(req.params.id, type);
    await saveSelection(details, type);
    return res.json(details);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch Spotify details" });
  }
});

export default router;
