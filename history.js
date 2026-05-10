import { readFile, writeFile } from "fs/promises";

const HISTORY_FILE = new URL("./search_history.json", import.meta.url);

export { readHistory, saveKeyword };

// read and parse search_history.json
const readHistory = async () => {
    try {
        const raw = await readFile(HISTORY_FILE, "utf-8");
        const history = JSON.parse(raw);
        return Array.isArray(history) ? history : [];
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }

        throw new Error("Could not read search_history.json", { cause: error });
    }
};

const writeHistory = async (history) => {
    try {
        await writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
    } catch (error) {
        throw new Error("Could not write search_history.json", { cause: error });
    }
};

// save keyword/type pair to history, skips duplicates
const saveKeyword = async (keyword, type = "artist") => {
    const history = await readHistory();

    const alreadySaved = history.some(
        (entry) =>
            entry.keyword.toLowerCase() === keyword.toLowerCase() &&
            entry.type === type,
    );

    if (alreadySaved) {
        return history;
    }

    const updatedHistory = [
        ...history,
        {
            keyword,
            type,
            searchedAt: new Date().toISOString(),
        },
    ];

    await writeHistory(updatedHistory);
    return updatedHistory;
};
