import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { search } from "./app.js";

const HISTORY_FILE = "./search_history.json";

export { listKeywords, saveKeyword, reSearch };

// reads from search_history.json
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

// ─── Exported Functions

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

const listKeywords = async () => {

    // Reads search_history.json and prints all past keywords to the console.
    const history = await readHistory();

    if (history.length === 0) {
        console.log("No search history yet. Run a search first.\n");
        return;
    }
    // Groups entries by type and shows the timestamp of each search.
    console.log(`\nSearch History  (${history.length} unique searches)\n`);
    console.log("  #   Keyword                          Type       Searched At");
    console.log("  ─── ──────────────────────────────── ────────── ──────────────────────");

    history.forEach((entry, i) => {
        const index   = String(i + 1).padEnd(3);
        const keyword = entry.keyword.padEnd(36);
        const type    = entry.type.padEnd(10);
        const date    = new Date(entry.searchedAt).toLocaleString();
        console.log(`  ${index} ${keyword} ${type} ${date}`);
    });
};

const reSearch = async (index) => {
    // Re-runs a past search by its 1-based index from the history list.
    const history = await readHistory();

    if (history.length === 0) {
        console.log("No search history yet. Nothing to re-search.\n");
        return;
    }

    const i = parseInt(index, 10);

    if (isNaN(i) || i < 1 || i > history.length) {
        console.error(
            `Invalid index "${index}". Choose a number between 1 and ${history.length}.\n`,
        );
        return;
    }

    const { keyword, type } = history[i - 1];

    console.log(`\nRe-searching: "${keyword}" (${type})\n`);
    await search(keyword, type);
};
