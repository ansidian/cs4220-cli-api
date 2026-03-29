// TODO: implement search functionality
import { saveKeyword } from "./history.js";

export const search = async (keyword, type) => {
  console.log(`Searching for "${keyword}" (type: ${type})...`);
  // For search history
  await saveKeyword(keyword, type);
};
