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

```bash
npm install
npm start
```

Create a `.env` file with:

```bash
CLIENT_ID=
CLIENT_SECRET=
DB_USER=spotify
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

Check that the server is running:

```bash
curl "localhost:3000/"
```

Search Spotify by keyword. The default type is `artist`:

```bash
curl "localhost:3000/spotify?keyword=drake"
```

Search Spotify by keyword and type:

```bash
curl "localhost:3000/spotify?keyword=drake&type=artist"
curl "localhost:3000/spotify?keyword=best%20i%20ever%20had&type=track"
curl "localhost:3000/spotify?keyword=take%20care&type=album"
```

Get detailed data by Spotify identifier:

```bash
curl "localhost:3000/spotify/3TVXtAsR1Inumwj472S9r4?type=artist"
```

Get saved search keyword history:

```bash
curl "localhost:3000/history?type=keywords"
```

Validation examples:

```bash
curl "localhost:3000/spotify"
curl "localhost:3000/spotify?keyword=drake&type=playlist"
curl "localhost:3000/history"
curl "localhost:3000/history?type=selections"
```

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
