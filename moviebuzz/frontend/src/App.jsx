
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_KEY = "23b3b2263486f306880b47249ce51ad4";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const releasedMovies = [
  { title: "RRR", year: 2022, genre: "Action", rating: 8.0 },
  { title: "Pushpa: The Rise", year: 2021, genre: "Action", rating: 7.6 },
  { title: "Baahubali: The Beginning", year: 2015, genre: "Action", rating: 8.0 },
  { title: "Baahubali 2: The Conclusion", year: 2017, genre: "Action", rating: 8.2 },
  { title: "Arjun Reddy", year: 2017, genre: "Romance", rating: 7.8 },
  { title: "Jersey", year: 2019, genre: "Drama", rating: 8.5 },
  { title: "Eega", year: 2012, genre: "Fantasy", rating: 7.7 },
  { title: "Rangasthalam", year: 2018, genre: "Drama", rating: 8.2 },
  { title: "Ala Vaikunthapurramuloo", year: 2020, genre: "Comedy", rating: 7.3 },
  { title: "Geetha Govindam", year: 2018, genre: "Romance", rating: 7.7 },
  { title: "Hi Nanna", year: 2023, genre: "Romance", rating: 8.2 },
  { title: "Hanu-Man", year: 2024, genre: "Fantasy", rating: 7.8 },
  { title: "Salaar: Part 1 - Ceasefire", year: 2023, genre: "Action", rating: 6.5 },
  { title: "Kalki 2898 AD", year: 2024, genre: "Sci-Fi", rating: 7.0 },
  { title: "Devara: Part 1", year: 2024, genre: "Action", rating: 6.0 },
  { title: "Game Changer", year: 2025, genre: "Action", rating: 5.0 },
  { title: "Sankranthiki Vasthunam", year: 2025, genre: "Comedy", rating: 7.0 },
  { title: "Mirai", year: 2025, genre: "Fantasy", rating: 7.0 },
  { title: "They Call Him OG", year: 2025, genre: "Action", rating: 7.0 },
  { title: "Court: State vs. A Nobody", year: 2025, genre: "Drama", rating: 8.0 }
];

const upcomingMovies = [
  { title: "Haindava", year: 2026, date: "27 November 2026", genre: "Action" },
  { title: "Mysaa", year: 2026, date: "27 November 2026", genre: "Action" },
  { title: "High", year: 2026, date: "27 November 2026", genre: "Thriller" },
  { title: "Alias Rukmini", year: 2026, date: "4 December 2026", genre: "Drama" },
  { title: "Legacy", year: 2026, date: "4 December 2026", genre: "Action" },
  { title: "Vrushakarma", year: 2026, date: "4 December 2026", genre: "Adventure" },
  { title: "Idupu Kayitham", year: 2026, date: "11 December 2026", genre: "Drama" },
  { title: "Pocket Rockkets", year: 2026, date: "11 December 2026", genre: "Comedy" },
  { title: "Alcohol", year: 2026, date: "18 December 2026", genre: "Thriller" },
  { title: "King 100", year: 2026, date: "24 December 2026", genre: "Drama" },
  { title: "Dada", year: 2026, date: "24 December 2026", genre: "Action" },
  { title: "Reality", year: 2026, date: "25 December 2026", genre: "Drama" }
];

const allMovies = [
  ...releasedMovies.map((movie, index) => ({
    ...movie,
    id: `released-${index}`,
    status: "Released"
  })),
  ...upcomingMovies.map((movie, index) => ({
    ...movie,
    id: `upcoming-${index}`,
    status: "Upcoming"
  }))
];

function App() {
  const [movies, setMovies] = useState(allMovies);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [section, setSection] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookings, setBookings] = useState(() =>
    JSON.parse(localStorage.getItem("moviebuzz-bookings") || "[]")
  );
  const [reviews, setReviews] = useState(() =>
    JSON.parse(localStorage.getItem("moviebuzz-reviews") || "{}")
  );
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [loading, setLoading] = useState(true);

  // Fetch real movie posters from TMDB
  useEffect(() => {
    let cancelled = false;

    async function loadPosters() {
      if (!API_KEY || API_KEY === "PASTE_YOUR_TMDB_API_KEY_HERE") {
        setLoading(false);
        return;
      }

      const updated = await Promise.all(
        allMovies.map(async (movie) => {
          try {
            const url =
              `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}` +
              `&query=${encodeURIComponent(movie.title)}` +
              `&year=${movie.year}`;

            const response = await fetch(url);
            if (!response.ok) return movie;

            const data = await response.json();
            const results = data.results || [];

            const match =
              results.find((item) => item.poster_path) || null;

            return {
              ...movie,
              poster: match?.poster_path
                ? IMAGE_BASE + match.poster_path
                : null,
              tmdbRating: match?.vote_average
            };
          } catch (error) {
            console.error("Poster loading error:", movie.title, error);
            return movie;
          }
        })
      );

      if (!cancelled) {
        setMovies(updated);
        setLoading(false);
      }
    }

    loadPosters();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesGenre =
        genre === "All" || movie.genre === genre;

      const matchesSection =
        section === "All" || movie.status === section;

      return matchesSearch && matchesGenre && matchesSection;
    });
  }, [movies, search, genre, section]);

  function saveBookings(updated) {
    setBookings(updated);
    localStorage.setItem("moviebuzz-bookings", JSON.stringify(updated));
  }

  function saveReviews(updated) {
    setReviews(updated);
    localStorage.setItem("moviebuzz-reviews", JSON.stringify(updated));
  }

  function bookTickets() {
    if (!selectedMovie || selectedMovie.status !== "Released") return;

    const booking = {
      id: Date.now(),
      movie: selectedMovie.title,
      quantity,
      total: quantity * 150,
      date: new Date().toLocaleString()
    };

    saveBookings([booking, ...bookings]);
    alert(
      `Booking confirmed!\nMovie: ${booking.movie}\nTickets: ${quantity}\nTotal: ₹${booking.total}`
    );
    setSelectedMovie(null);
    setQuantity(1);
  }

  function submitReview(movieId) {
    if (!reviewText.trim()) {
      alert("Please write your review first.");
      return;
    }

    const existing = reviews[movieId] || [];
    const updated = {
      ...reviews,
      [movieId]: [
        ...existing,
        {
          text: reviewText,
          rating: reviewRating,
          date: new Date().toLocaleDateString()
        }
      ]
    };

    saveReviews(updated);
    setReviewText("");
    setReviewRating(5);
  }

  return (
    <div className="moviebuzz">
      <style>{`
        .moviebuzz {
          min-height: 100vh;
          background: #101014;
          color: white;
          font-family: Arial, sans-serif;
        }
        .mb-header {
          background: #19191f;
          padding: 20px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          border-bottom: 1px solid #333;
        }
        .mb-logo { font-size: 28px; font-weight: 900; color: #ff4242; }
        .mb-logo span { color: white; }
        .mb-nav { display: flex; gap: 10px; flex-wrap: wrap; }
        .mb-nav button, .mb-btn {
          border: 0;
          border-radius: 7px;
          padding: 10px 15px;
          background: #292932;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }
        .mb-nav button.active, .mb-primary {
          background: #e53945;
        }
        .mb-hero {
          padding: 65px 6%;
          background: linear-gradient(90deg, #220d15, #35151b, #15151c);
        }
        .mb-hero h1 { font-size: clamp(32px, 5vw, 55px); margin: 0 0 12px; }
        .mb-hero p { color: #ddd; font-size: 17px; }
        .mb-container { padding: 30px 5%; }
        .mb-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin: 20px 0 30px;
        }
        .mb-controls input, .mb-controls select {
          padding: 12px;
          border-radius: 7px;
          border: 1px solid #444;
          background: #202027;
          color: white;
          min-width: 180px;
        }
        .mb-heading {
          font-size: 25px;
          margin: 25px 0 18px;
          border-left: 5px solid #e53945;
          padding-left: 12px;
        }
        .mb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
          gap: 22px;
        }
        .mb-card {
          background: #1d1d24;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #303039;
          transition: transform .2s;
        }
        .mb-card:hover { transform: translateY(-5px); }
        .mb-poster {
          height: 265px;
          background: #292932;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #aaa;
          text-align: center;
          padding: 12px;
        }
        .mb-poster img { width: 100%; height: 100%; object-fit: cover; }
        .mb-card-body { padding: 13px; }
        .mb-card h3 { font-size: 16px; margin: 0 0 8px; min-height: 38px; }
        .mb-muted { color: #aaa; font-size: 13px; line-height: 1.6; }
        .mb-status {
          display: inline-block;
          background: #333;
          color: #ffb4b4;
          font-size: 11px;
          padding: 5px 8px;
          border-radius: 5px;
          margin-bottom: 8px;
        }
        .mb-card .mb-btn { width: 100%; margin-top: 12px; }
        .mb-card .mb-btn:disabled { opacity: .5; cursor: not-allowed; }
        .mb-modal-bg {
          position: fixed;
          inset: 0;
          background: #000b;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 15px;
          z-index: 10;
        }
        .mb-modal {
          background: #202027;
          border: 1px solid #444;
          border-radius: 12px;
          padding: 25px;
          width: 100%;
          max-width: 450px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .mb-modal input, .mb-modal textarea {
          width: 100%;
          padding: 11px;
          margin: 10px 0;
          background: #111;
          color: white;
          border: 1px solid #555;
          border-radius: 6px;
        }
        .mb-modal textarea { min-height: 75px; }
        .mb-modal button { margin: 5px 5px 5px 0; }
        .mb-review {
          border-top: 1px solid #444;
          padding: 10px 0;
          font-size: 13px;
        }
        .mb-booking {
          background: #202027;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .mb-footer {
          text-align: center;
          padding: 30px;
          color: #aaa;
          background: #19191f;
          margin-top: 35px;
          font-size: 13px;
        }
        @media(max-width:600px) {
          .mb-header { justify-content: center; }
          .mb-hero { padding: 40px 6%; }
          .mb-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
          .mb-poster { height: 220px; }
        }
      `}</style>

      <header className="mb-header">
        <div className="mb-logo">MOVIE<span>BUZZ</span></div>
        <nav className="mb-nav">
          <button
            className={section === "All" ? "active" : ""}
            onClick={() => setSection("All")}
          >
            All Movies
          </button>
          <button
            className={section === "Released" ? "active" : ""}
            onClick={() => setSection("Released")}
          >
            Now Showing
          </button>
          <button
            className={section === "Upcoming" ? "active" : ""}
            onClick={() => setSection("Upcoming")}
          >
            Upcoming
          </button>
          <button onClick={() =>
            document.getElementById("booking-history")?.scrollIntoView({
              behavior: "smooth"
            })
          }>
            My Bookings
          </button>
        </nav>
      </header>

      <section className="mb-hero">
        <h1>Welcome to MovieBuzz</h1>
        <p>Discover movies. Explore Telugu cinema. Book your tickets!</p>
      </section>

      <main className="mb-container">
        <h2 className="mb-heading">Explore Movies</h2>

        <div className="mb-controls">
          <input
            type="text"
            placeholder="Search movie name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="All">All Genres</option>
            <option value="Action">Action</option>
            <option value="Romance">Romance</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
            <option value="Adventure">Adventure</option>
          </select>
        </div>

        {loading && (
          <p className="mb-muted">Loading movie posters from TMDB...</p>
        )}

        {filteredMovies.length === 0 && (
          <p>No movies found. Try another search.</p>
        )}

        <div className="mb-grid">
          {filteredMovies.map((movie) => (
            <article className="mb-card" key={movie.id}>
              <div className="mb-poster">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.textContent =
                        movie.title + " - Poster unavailable";
                    }}
                  />
                ) : (
                  <span>{movie.title}<br />Poster unavailable</span>
                )}
              </div>

              <div className="mb-card-body">
                <span className="mb-status">{movie.status}</span>
                <h3>{movie.title}</h3>
                <div className="mb-muted">
                  {movie.year} • {movie.genre}
                </div>
                {movie.status === "Upcoming" ? (
                  <div className="mb-muted">
                    Release: {movie.date}
                  </div>
                ) : (
                  <div className="mb-muted">
                    ⭐ {movie.rating}/10
                  </div>
                )}

                <button
                  className="mb-btn mb-primary"
                  onClick={() => {
                    setSelectedMovie(movie);
                    setQuantity(1);
                  }}
                >
                  {movie.status === "Upcoming"
                    ? "View Details"
                    : "Book / Review"}
                </button>
              </div>
            </article>
          ))}
        </div>

        <section id="booking-history">
          <h2 className="mb-heading">My Booking History</h2>
          {bookings.length === 0 ? (
            <p className="mb-muted">You have no bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <div className="mb-booking" key={booking.id}>
                <strong>{booking.movie}</strong>
                <p className="mb-muted">
                  Tickets: {booking.quantity} | Total: ₹{booking.total}
                </p>
                <p className="mb-muted">{booking.date}</p>
              </div>
            ))
          )}
        </section>
      </main>

      {selectedMovie && (
        <div
          className="mb-modal-bg"
          onClick={() => setSelectedMovie(null)}
        >
          <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="mb-btn"
              onClick={() => setSelectedMovie(null)}
              style={{ float: "right" }}
            >
              Close ✕
            </button>

            <h2>{selectedMovie.title}</h2>
            <p className="mb-muted">
              {selectedMovie.year} • {selectedMovie.genre}
            </p>

            {selectedMovie.status === "Upcoming" ? (
              <>
                <p style={{ marginTop: 18 }}>
                  <strong>Upcoming theatrical release</strong>
                </p>
                <p className="mb-muted">
                  Expected release date: {selectedMovie.date}
                </p>
                <p className="mb-muted">
                  Ticket booking is not available in this demo yet.
                  Booking can be enabled when official advance sales open.
                </p>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 20 }}>Book Your Tickets</h3>
                <p className="mb-muted">Ticket price: ₹150 each</p>

                <label>Number of tickets</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Math.min(10, Number(e.target.value) || 1))
                    )
                  }
                />

                <h3>Total: ₹{quantity * 150}</h3>

                <button
                  className="mb-btn mb-primary"
                  onClick={bookTickets}
                >
                  Confirm Booking
                </button>

                <p className="mb-muted">
                  Demo booking only. No real payment is collected.
                </p>
              </>
            )}

            <hr style={{ borderColor: "#444", margin: "20px 0" }} />

            <h3>Reviews and Ratings</h3>

            {(reviews[selectedMovie.id] || []).length === 0 ? (
              <p className="mb-muted">No reviews yet. Be the first!</p>
            ) : (
              reviews[selectedMovie.id].map((review, index) => (
                <div className="mb-review" key={index}>
                  <div>{"⭐".repeat(review.rating)}</div>
                  <p>{review.text}</p>
                  <span className="mb-muted">{review.date}</span>
                </div>
              ))
            )}

            {selectedMovie.status === "Released" && (
              <>
                <label>Your rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  style={{
                    display: "block",
                    padding: 10,
                    background: "#111",
                    color: "white",
                    border: "1px solid #555",
                    borderRadius: 6,
                    marginTop: 8
                  }}
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 stars</option>
                  <option value="3">⭐⭐⭐ 3 stars</option>
                  <option value="2">⭐⭐ 2 stars</option>
                  <option value="1">⭐ 1 star</option>
                </select>

                <textarea
                  placeholder="Write your movie review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />

                <button
                  className="mb-btn mb-primary"
                  onClick={() => submitReview(selectedMovie.id)}
                >
                  Submit Review
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="mb-footer">
        <p>© 2026 MovieBuzz | Telugu Movie Booking Demo</p>
        <p style={{ marginTop: 8 }}>
          Movie data and posters provided by TMDB. This product uses the TMDB
          API but is not endorsed or certified by TMDB.
        </p>
      </footer>
    </div>
  );
}

export default App;
