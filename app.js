import fs from "fs/promises" // for read wrie functionality
import inquirer  from "inquirer"; // for user cli ui 
//commented out below api call until darsahn finishes 
//import { searchSpotify, getById } from "./api.js"; // Darshans api call gets imported here 

// TODO: implement search functionality
// temporary fake data for testing


export const search = async (keyword, type) => {

  // fake data fo rme to test cli
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const results = [
  { id: "1", name: "Best I Ever Had", artist: "Drake", album: "So Far Gone" },
  { id: "2", name: "Best I Ever Had", artist: "Gavin DeGraw", album: "Chariot" },
  { id: "3", name: "Best of You", artist: "Foo Fighters", album: "In Your Honor" },
];                                                                          //Deleting this once api is finished
const details = {
  name: "Best I Ever Had",
  artists: [{ name: "Drake" }],
  album: { name: "So Far Gone", release_date: "2009-09-15" },
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
 

  //uncoment bottom code when api is finsined
   //calling api search functiom from api.js
  //const results = await searchSpotify(keyword, type);

  const file = await fs.readFile("search_history.json", "utf-8"); //searches file in plain english 
  const history = JSON.parse(file)

  if(!history.includes(keyword)){ //search hsitory array if not in there write to json
    history.push(keyword);
    await fs.writeFile("search_history.json", JSON.stringify(history, null, 2));//writes data to json readibly 
  }

  const options = results.map((song_details) => ({
    // basic ui with optoins 
    name : `${song_details.name} - ${song_details.artist} - ${song_details.album}`, // note my change depending on darshans api call
    value: song_details.id,

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
  //const details = await getById(choice.selected, type);


  // display selection data 
  console.log(`\nTrack: ${details.name}`);
  console.log(`Artist: ${details.artists[0].name}`);
  console.log(`Album: ${details.album.name}`);
  console.log(`Release Date: ${details.album.release_date}\n`);
};
