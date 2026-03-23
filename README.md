# CS4220 Midterm Project — Spotify CLI

A Node.js Command Line Interface application that interacts with the [Spotify Web API](https://developer.spotify.com/documentation/web-api) to search for music and retrieve detailed track/artist/album information, while maintaining a local search history.

## API Selection

**Spotify Web API** — supports keyword search and lookup by unique ID:

- **Search endpoint** — search by keyword across tracks, artists, albums, etc.
- **Get by ID endpoint** — retrieve detailed data for a specific item by its Spotify ID

## Project Structure

| File | Purpose |
|-|-|
| `cli.js` | CLI entry point — parses commands and arguments |
| `app.js` | Search functionality — API search, history save, display results |
| `api.js` | API module — handles HTTP requests to Spotify Web API |
| `history.js` | History functionality — browse and re-search past keywords |
| `search_history.json` | Stores unique search keywords |
| `package.json` | Project metadata and dependencies |

## Commands

```
node cli.js --help                  Show available commands
node cli.js search <keyword>        Search Spotify by keyword
node cli.js history keywords        Browse past search keywords
```

## Setup

```bash
npm install
```