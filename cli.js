import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { listKeywords, search } from "./app.js";

yargs(hideBin(process.argv))
  .command(
    // example: `node cli.js search -t track 'best i ever had'`
    "search <keyword>",
    "search Spotify by keyword",
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
    (args) => {
      search(args.keyword, args.type);
    },
  )
  .command(
    // example: `node cli.js history keywords`
    "history <action>",
    "look at previous search history",
      (yargs) => {
          yargs
              .positional("action", {
                  describe: "type of history to view",
                  type: "string",
              });
      },
    (args) => {
        if (args.action === "keywords") {
            listKeywords();
        } else {
            console.log(`Invalid action: ${args.action}`);
      }
    },
  )
  .help().argv;
