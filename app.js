import fs from "fs/promises" // for read wrie functionality
import inquirer  from "inquirer"; // for user cli ui 
//commented out below api call until darsahn finishes 
import { searchSpotify, getById } from "./api.js"; // Darshans api call gets imported here 

// TODO: implement search functionality
// temporary fake data for testing


export const search = async (keyword, type) => {


 

  //uncoment bottom code when api is finsined
   //calling api search functiom from api.js
  const results = await searchSpotify(keyword, type);

  const items = results[`${type}s`].items;

  const file = await fs.readFile("search_history.json", "utf-8"); //searches file in plain english 
  const history = JSON.parse(file)

  if(!history.includes(keyword)){ //search hsitory array if not in there write to json
    history.push(keyword);
    await fs.writeFile("search_history.json", JSON.stringify(history, null, 2));//writes data to json readibly 
  }

  const options = items.map((item) => ({
    name: type === "track"
      ? `${item.name} - ${item.artists[0].name} - ${item.album.name}`
      : `${item.name}`,
    value: item.id,
}))

  /// basic list ootions for users to  select
  const choice = await inquirer.prompt([{
    type : "select",
    name : "selected",
    message: "Select a song",
    choices: options, 
  },
  ])
  //uncomment bottom code when api is finished
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
