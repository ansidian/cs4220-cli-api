import inquirer  from "inquirer"; // for user cli ui
import { searchSpotify, getById } from "./api.js"; // Darshans api call gets imported here
import { saveKeyword } from "./history.js";

export const search = async (keyword, type) => {

  //calling api search function from api.js
  const results = await searchSpotify(keyword, type);

  const items = results[`${type}s`].items;

  // save keyword to search history
  await saveKeyword(keyword, type);

  const options = items.map((item) => ({
    name: type === "track"
      ? `${item.name} - ${item.artists[0].name} - ${item.album.name}`
      : `${item.name}`,
    value: item.id,
  }))

  // list options for users to select
  const choice = await inquirer.prompt([{
    type : "select",
    name : "selected",
    message: "Select a song",
    choices: options,
  },
  ])

  const details = await getById(choice.selected, type);

  // display selection data
  if (type === "track") {
    console.log(`\nTrack: ${details.name}`);
    console.log(`Artist: ${details.artists[0].name}`);
    console.log(`Album: ${details.album.name}`);
    console.log(`Release Date: ${details.album.release_date}\n`);
  } else if (type === "artist") {
    console.log(`\nArtist: ${details.name}`);
    console.log(`Genres: ${details.genres.join(", ")}`);
    console.log(`Followers: ${details.followers.total}\n`);
  } else if (type === "album") {
    console.log(`\nAlbum: ${details.name}`);
    console.log(`Artist: ${details.artists[0].name}`);
    console.log(`Release Date: ${details.release_date}`);
    console.log(`Tracks: ${details.total_tracks}\n`);
  }
};
