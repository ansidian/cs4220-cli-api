import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import inquirer from "inquirer";
import { search } from "./app.js";

const HISTORY_FILE = "./search_history.json";

export { listKeywords, saveKeyword };

// read and parse search_history.json
const readHistory = async () => {
    if (!existsSync(HISTORY_FILE)) return [];
    try {
        const raw = await readFile(HISTORY_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        console.error("Could not read search_history.json, starting from scratch");
        return [];
    }
};

const writeHistory = async (history) => {
    await writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
};

// save keyword/type pair to history, skips duplicates
const saveKeyword = async (keyword, type = "artist") => {
    const history = await readHistory();

    const alreadySaved = history.some(
        (entry) =>
            entry.keyword.toLowerCase() === keyword.toLowerCase() &&
            entry.type === type,
    );

    if (!alreadySaved) {
        history.push({
            keyword,
            type,
            searchedAt: new Date().toISOString(),
        });
        await writeHistory(history);
    }
};

// show list prompt of past keywords, re-run search on selection
const listKeywords = async () => {
    const history = await readHistory();

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
