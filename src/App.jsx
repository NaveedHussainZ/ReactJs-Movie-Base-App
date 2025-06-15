import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";

// OMDb API Configuration
const OMDb_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const OMDb_BASE_URL = "https://www.omdbapi.com/";

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${OMDb_BASE_URL}?apikey=${OMDb_API_KEY}&s=${encodeURIComponent(
            query
          )}&type=movie`
        : `${OMDb_BASE_URL}?apikey=${OMDb_API_KEY}&s=movie&type=movie`; // Default popular movies

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      console.log("API Response:", data); // For debugging

      if (data.Response === "False") {
        setErrorMessage(data.Error || "No movies found");
        setMovieList([]);
        return;
      }

      // Enhance movie data with additional details
      const enhancedMovies = await Promise.all(
        data.Search.map(async (movie) => {
          try {
            // Fetch detailed info for each movie to get rating
            const detailResponse = await fetch(
              `${OMDb_BASE_URL}?apikey=${OMDb_API_KEY}&i=${movie.imdbID}&plot=short`
            );
            const details = await detailResponse.json();
            return {
              ...movie,
              imdbRating: details.imdbRating,
              Language: details.Language?.split(", ")[0] || "EN",
            };
          } catch (error) {
            console.error("Error fetching movie details:", error);
            return movie;
          }
        })
      );

      setMovieList(enhancedMovies);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== "" || debouncedSearchTerm === "") {
      fetchMovies(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>{debouncedSearchTerm ? "Search Results" : "Popular Movies"}</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
            <ul className="movies-grid">
              {movieList.map((movie) => (
                <li key={movie.imdbID}>
                  <MovieCard movie={movie} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
