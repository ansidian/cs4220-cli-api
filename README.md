# CS4220 Spotify Server API

A Node.js Express server application that interacts with the [Spotify Web API](https://developer.spotify.com/documentation/web-api) to search for music and retrieve detailed track/artist/album information, while storing unique search keywords in MongoDB Atlas.

## API Selection

**Spotify Web API** — supports keyword search and lookup by unique ID:

- **Search endpoint** — search by keyword across tracks, artists, albums, etc.
- **Get by ID endpoint** — retrieve detailed data for a specific item by its Spotify ID

## Project Structure

| File | Purpose |
|-|-|
| `server.js` | Express server entry point |
| `cli.js` | Shortcut command client that calls the Express API |
| `routes/spotify.js` | Spotify search and detail endpoints |
| `routes/history.js` | Search keyword history endpoint |
| `services/api.js` | Spotify API service module |
| `services/db.js` | MongoDB Atlas helper from Week 14 |
| `package.json` | Project metadata and dependencies |

## Endpoints

```
GET /spotify?keyword=<keyword>
GET /spotify?keyword=<keyword>&type=track
GET /spotify/:id
GET /spotify/:id?type=track
GET /history?type=keywords
```

`/spotify` returns an array of clean search results:

```json
[
  {
    "display": "Drake",
    "identifier": "3TVXtAsR1Inumwj472S9r4"
  }
]
```

`/history?type=keywords` returns saved search keyword records without MongoDB `_id` values.
Calling `/spotify/:id` also stores the selected Spotify item in the `SelectionHistory` collection.

## Setup

Create a `.env` file with:

```bash
CLIENT_ID=
CLIENT_SECRET=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_NAME=
```

## Commands

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The server runs at:

```text
localhost:3000
```

Use the shortcut commands from a second terminal while the server is running.
These commands call the Express API, so they use the same MongoDB-backed search
and history behavior as the HTTP endpoints.

Search by type:

```bash
npm run artist -- "drake"
npm run track -- "best i ever had"
npm run album -- "take care"
```

Search with an explicit type:

```bash
npm run search -- -t track "best i ever had"
```

The search commands show an interactive result picker. Selecting a result calls
the Express detail endpoint and saves the selected item in MongoDB.

The `history` command calls the Express history endpoint and prints saved search
keywords:

```bash
npm run history
```

For direct API testing, use the endpoint list above in a browser or API client.

Optional MongoDB verification:

```bash
set -a
source .env
set +a
mongosh "mongodb+srv://$DB_USER:$DB_PASSWORD@$DB_HOST/$DB_NAME" --quiet
```

Inside `mongosh`, check the saved collections:

```js
db.SearchHistoryKeyword.find({}, { _id: 0 }).toArray()
db.SelectionHistory.find({}, { _id: 0 }).toArray()
```
