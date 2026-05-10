import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import axios from "axios";
import inquirer from "inquirer";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
const VALID_TYPES = new Set(["artist", "track", "album"]);

const normalizeKeyword = (keyword) => {
  if (Array.isArray(keyword)) {
    return keyword.join(" ").trim();
  }

  return typeof keyword === "string" ? keyword.trim() : "";
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

const printApiError = (error) => {
  if (error.response?.data?.error) {
    console.error(error.response.data.error);
    return;
  }

  if (error.code === "ECONNREFUSED") {
    console.error(`Could not connect to ${API_BASE_URL}. Start the Express server with npm start first.`);
    return;
  }

  console.error(error.message);
};

const formatDetails = (details, type) => {
  if (type === "track") {
    return [
      `Track: ${details.name}`,
      `Artist: ${details.artists?.[0]?.name || "N/A"}`,
      `Album: ${details.album?.name || "N/A"}`,
      `Release Date: ${details.album?.release_date || "N/A"}`,
    ];
  }

  if (type === "album") {
    return [
      `Album: ${details.name}`,
      `Artist: ${details.artists?.[0]?.name || "N/A"}`,
      `Release Date: ${details.release_date || "N/A"}`,
      `Tracks: ${details.total_tracks ?? "N/A"}`,
    ];
  }

  return [
    `Artist: ${details.name}`,
    `Genres: ${details.genres?.join(", ") || "N/A"}`,
    `Followers: ${details.followers?.total ?? "N/A"}`,
  ];
};

const getDetails = async (identifier, type) => {
  const response = await api.get(`/spotify/${identifier}`, {
    params: { type },
  });

  console.log(`\n${formatDetails(response.data, type).join("\n")}\n`);
};

const search = async (keywordInput, type) => {
  const keyword = normalizeKeyword(keywordInput);

  if (!keyword) {
    console.error("Search keyword is required.");
    return;
  }

  if (!VALID_TYPES.has(type)) {
    console.error("Type must be artist, track, or album.");
    return;
  }

  try {
    const response = await api.get("/spotify", {
      params: { keyword, type },
    });

    const results = Array.isArray(response.data) ? response.data : [];

    if (results.length === 0) {
      console.log("No results found.");
      return;
    }

    const { selected } = await inquirer.prompt([{
      type: "select",
      name: "selected",
      message: `Select a ${type}`,
      choices: [
        { name: "Exit", value: null },
        ...results.map((item) => ({
          name: item.display,
          value: item.identifier,
        })),
      ],
    }]);

    if (!selected) return;

    await getDetails(selected, type);
  } catch (error) {
    printApiError(error);
  }
};

const listKeywords = async () => {
  try {
    const response = await api.get("/history", {
      params: { type: "keywords" },
    });

    const history = Array.isArray(response.data) ? response.data : [];

    if (history.length === 0) {
      console.log("No search history yet. Run a search first.");
      return;
    }

    history.forEach((entry) => {
      console.log(`${entry.keyword} (${entry.type}) - ${entry.searchedAt}`);
    });
  } catch (error) {
    printApiError(error);
  }
};

yargs(hideBin(process.argv))
  .command(
    "search <keyword..>",
    "search Spotify through the Express API",
    (yargs) => {
      yargs
        .positional("keyword", {
          describe: "search query",
          type: "string",
        })
        .option("type", {
          describe: "type of search",
          alias: "t",
          type: "string",
          choices: ["artist", "track", "album"],
          default: "artist",
        });
    },
    (args) => search(args.keyword, args.type),
  )
  .command(
    "history",
    "list saved search history through the Express API",
    () => {},
    () => listKeywords(),
  )
  .demandCommand(1, "Choose search or history.")
  .strict()
  .help()
  .argv;
