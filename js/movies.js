export default class MovieHelper {

    constructor() {
        this.api_root = "https://api.imdbapi.dev"
    }

    async getMovies() {
        const url = `${this.api_root}/titles?types=MOVIE`;

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

    async getMovieById(id) {
        const url = `${this.api_root}/titles/${id}`;

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    }

    async getMoviesByGenre(genre) {
        const url = `${this.api_root}/titles?types=MOVIE&genres=${genre}`;

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

    async getMoviesByStartYear(year) {
        const url = `${this.api_root}/titles?types=MOVIE&startYear=${year}`;

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

    async getMoviesByKeyword(keyword) {
        const url = `${this.api_root}/search/titles?query=${keyword}`;

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
        console.log(data.titles);
        let titles = data.titles;

        titles = titles.forEach(element => {
            this.getMovieById(element.id).then(movie => {
                Object.assign(element, movie);
            });
        });

        return titles;


    }

    async addToWatchlist(movieId) {
        console.log(`Movie with ID ${movieId} added to watchlist.`);
        return { success: true, movieId: movieId };
    }
}
