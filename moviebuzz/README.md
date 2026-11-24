# Traditional Movie Club — Full-stack project

A beginner-friendly React + Vite frontend and Node.js + Express + MongoDB backend.

## Included
- 50 starter movies across Action, Sci-Fi, Romance, Horror, Thriller, Mystery, Animation, Comedy, Drama, Fantasy and Adventure.
- Search and genre filters.
- Movie detail view and review form.
- Add, edit and delete movie UI (requires backend).
- MongoDB collections for movies, reviews and tickets.
- Automatic first-run seeding: when MongoDB has no movie records, the backend inserts the starter catalogue.

## Requirements
- Node.js LTS
- VS Code
- MongoDB Atlas account (or local MongoDB)

## 1. Configure MongoDB
1. In MongoDB Atlas, create a free cluster, database user, and allow your current IP address in Network Access.
2. Copy the Node.js connection string.
3. In VS Code, open `backend/.env.example`, copy its contents into a new file named `backend/.env`.
4. Replace the example `MONGO_URI` with your real connection string. Use the database name `movieclub`.
5. Do not share or upload `.env`; it contains your database password.

## 2. Start backend
Open a VS Code terminal in the project root and run:
```bash
cd backend
npm install
npm run dev
```
On first successful connection, the backend seeds the 50 starter movies if the movies collection is empty. Keep this terminal open.
Backend: http://localhost:5000

## 3. Start frontend
Open a SECOND terminal in VS Code and run:
```bash
cd frontend
npm install
npm run dev
```
Open the Local URL shown by Vite, usually http://localhost:5173.

## Preview without MongoDB
The React app shows its built-in 50-movie catalogue even if the backend is not running. Search, filters and movie details work in preview mode. Saving reviews or adding/editing/deleting database records requires the backend and MongoDB.

## Poster note
Posters use image URLs from TMDB's public image CDN. An internet connection is needed to load them. If a poster URL is unavailable, the app displays a styled fallback poster. This project does not include copyrighted poster image files.

## Troubleshooting
- `MongoDB connection failed`: check the URI, username/password, and Atlas IP access list.
- `Failed to fetch` or preview mode: start the backend terminal and check `http://localhost:5000`.
- `npm is not recognized`: install Node.js LTS and restart VS Code.
- If port 5000 is busy, stop the other server or change `PORT` in `backend/.env`.
