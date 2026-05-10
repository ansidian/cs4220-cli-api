import inquirer from "inquirer";
import { searchSpotify, getById } from "./api.js";
import { readHistory, saveKeyword } from "./history.js";

export const listKeywords = async () => {
  let history;

  try {
    history = await readHistory();
  } catch (error) {
    console.error(error.message);
    return;
  }

  if (history.length === 0) {
    console.log("No search history yet. Run a search first.\n");
    return;
  }

  const choices = [
    { name: "Exit", value: null },
    ...history.map((entry) => ({
      name: `${entry.keyword} (${entry.type})`,
      value: entry,
    })),
  ];

  const { selected } = await inquirer.prompt([{
    type: "select",
    name: "selected",
    message: "Select a keyword to re-search",
    choices,
  }]);

  if (!selected) return;

  await search(selected.keyword, selected.type);
};

export const search = async (keyword, type) => {
  const results = await searchSpotify(keyword, type);

  const items = results[`${type}s`].items;

  try {
    await saveKeyword(keyword, type);
  } catch (error) {
    console.error(error.message);
  }

  const options = items.map((item) => ({
    name: type === "track"
      ? `${item.name} - ${item.artists[0].name} - ${item.album.name}`
      : `${item.name}`,
    value: item.id,
  }))

  const choice = await inquirer.prompt([{
    type : "select",
    name : "selected",
    message: "Select a song",
    choices: options,
  },
  ])

  const details = await getById(choice.selected, type);

  if (type === "track") {
    console.log(`\nTrack: ${details.name}`);
    console.log(`Artist: ${details.artists[0].name}`);
    console.log(`Album: ${details.album.name}`);
    console.log(`Release Date: ${details.album.release_date}\n`);
  } else if (type === "artist") {
    console.log(`\nArtist: ${details.name}`);
    console.log(`Genres: ${details.genres?.join(", ") || "N/A"}`);
    console.log(`Followers: ${details.followers?.total ?? "N/A"}\n`);
  } else if (type === "album") {
    console.log(`\nAlbum: ${details.name}`);
    console.log(`Artist: ${details.artists[0].name}`);
    console.log(`Release Date: ${details.release_date}`);
    console.log(`Tracks: ${details.total_tracks}\n`);
  }
};
