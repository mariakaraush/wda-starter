import MovieHelper from "./movies.js"
import { appData } from "./appData.js";
import StreamingServiceHelper from "./streamingServices.js";
import RunTimeApi from "./runTimeApi.js";

// By default, modules have their own scope, so we need to manually create our own
// loadMovies function on the window object, which can be used to interact with
// MovieHelper from our HTML page
window.loadMovies = async () => {
    // Create an instance of our MovieHelper class, so we can use the functions on it
    const Movies = new MovieHelper();

    // Get movies from API, using await because getMovies is an async function
    return await Movies.getMovies();
}

window.getStreamingServices = async (movieId) => {
    const StreamingServices = new StreamingServiceHelper();
    return await StreamingServices.getStreamingServices(movieId);
}

window.getMovieCredits = async (movieId) => {
    const Movies = new MovieHelper();
    return await Movies.getMovieCredits(movieId);
}

window.getMovieById = async (movieId) => {
    const Movies = new MovieHelper();
    return await Movies.getMovieById(movieId);
}

// Filters
window.getMoviesByGenre = async (genre) => {
    const Movies = new MovieHelper();
    return await Movies.getMoviesByGenre(genre);
}

window.getMoviesByStartYear = async (startYear) => {
    const Movies = new MovieHelper();
    return await Movies.getMoviesByStartYear(startYear);
}

window.getMoviesByYearOrGenre = async (startYear = null, genre = null) => {
    const Movies = new MovieHelper();
    return await Movies.filterMoviesByYearOrGenre(startYear, genre);
}

window.getMoviesByKeyword = async (keyword) => {
    const Movies = new MovieHelper();
    return await Movies.getMoviesByKeyword(keyword);
}

window.getMoviesWithRuntime = async (minRuntime, maxRuntime) => {
    const runTimeApi = new RunTimeApi();
    return await runTimeApi.getMoviesWithRuntime(minRuntime, maxRuntime);
}
window.appData = appData;

  