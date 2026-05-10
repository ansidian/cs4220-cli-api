import express from "express";

import db from "../services/db.js";

const router = express.Router();
const COLLECTION = "SearchHistoryKeyword";

router.get("/", async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "type query parameter is required" });
  }

  if (type !== "keywords") {
    return res.status(400).json({ error: "type must be keywords" });
  }

  try {
    const cursor = await db.find(COLLECTION);
    const history = cursor ? await cursor.toArray() : [];

    return res.json(history.map((entry) => ({
      keyword: entry.keyword,
      type: entry.type,
      searchedAt: entry.searchedAt,
    })));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch history" });
  }
});

export default router;
