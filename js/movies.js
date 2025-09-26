export default class MovieHelper {

    constructor() {
        this.api_root = "https://api.imdbapi.dev"
    }

    async getMovies() {
        const url = `${this.api_root}/titles`;

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };

        const response = await fetch(url, options);

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.titles;
    }

    async getMovieCredits(id) {
        const url = `${this.api_root}/titles/${id}/credits`;

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };

        const response = await fetch(url, options);

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.credits;
    }

    async addToWatchlist(movieId) {
        console.log(`Movie with ID ${movieId} added to watchlist.`);
        return { success: true, movieId: movieId };
    }
}
