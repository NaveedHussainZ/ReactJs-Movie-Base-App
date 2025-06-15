import React from "react";

const MovieCard = ({ movie }) => {
  const {
    Title: title = "No title available",
    Poster: poster = "N/A",
    Year: year = "N/A",
    imdbRating: rating = "N/A",
    Language: language = "EN",
  } = movie || {};

  return (
    <div className="movie-card">
      <img
        src={poster !== "N/A" ? poster : "/no-movie.png"}
        alt={title}
        onError={(e) => {
          e.target.src = "/no-movie.png";
          e.target.alt = "Poster not available";
        }}
        loading="lazy"
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Rating" />
            <p>{rating === "N/A" ? "N/A" : rating}</p>
          </div>

          <span>•</span>
          <p className="lang">{language.split(",")[0]}</p>

          <span>•</span>
          <p className="year">{year}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
