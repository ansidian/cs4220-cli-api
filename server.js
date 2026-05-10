import dotenv from "dotenv";
import express from "express";

import historyRoutes from "./routes/history.js";
import spotifyRoutes from "./routes/spotify.js";
import db from "./services/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const REQUIRED_ENV = [
  "CLIENT_ID",
  "CLIENT_SECRET",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_NAME",
];

app.use(express.json());
app.use("/spotify", spotifyRoutes);
app.use("/history", historyRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Spotify CS4220 API server",
    endpoints: ["/spotify?keyword=drake", "/spotify/:id", "/history?type=keywords"],
  });
});

const start = async () => {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (process.env.DB_USER !== "spotify") {
    console.error("DB_USER must be spotify");
    process.exit(1);
  }

  await db.connect();

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};

start();
