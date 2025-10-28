export default class MovieHelper {

    constructor() {
        this.api_root = "https://api.themoviedb.org/3";
        this.api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZDUyMTc4MjU3MmY2MTdiYmE1OWJhZTdiOTZmZGM4ZSIsIm5iZiI6MTc1NjgxOTQzNy40NjMsInN1YiI6IjY4YjZlZmVkYWVkYWMwOWY5ODIwMTYwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wtJvoe2Yl5p3qg8yW-YfKaE41pNS3cx1mbnkEK2OMqI";
    }

    async makeApiCall(endpoint) {
        const url = `${this.api_root}${endpoint}`;

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.api_key}`
            }
        };

        const response = await fetch(url, options);

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    }   

    async getMovies() {
        const data = await this.makeApiCall('/discover/movie');
        return data.results;
    }

    async getMovieCredits(id) {
        const data = await this.makeApiCall(`/movie/${id}/credits`);
        return data.cast;
    }

    async getMovieById(id) {
        const data = await this.makeApiCall(`/movie/${id}`);
        return data;
    }

    async filterMoviesByYearOrGenreOrByRunTime(startYear, genre, minRuntime, maxRuntime) {
        if(!startYear && !minRuntime && !maxRuntime) {
            return await this.getMoviesByGenre(genre);
        } else if (!genre && !minRuntime && !maxRuntime) {
            return await this.getMoviesByStartYear(startYear);
        } else if (!startYear && !genre && minRuntime && maxRuntime) {
            return await this.getMoviesByRuntime(minRuntime, maxRuntime);
        } else {
            const genreId = await this.getGenreId(genre);
            const endpoint = `/discover/movie?primary_release_year=${startYear}&with_genres=${genreId}&with_runtime.gte=${minRuntime}&with_runtime.lte=${maxRuntime}`;

            const data = await this.makeApiCall(endpoint);
            return data.results;
        }


    }
    async getMoviesByRuntime(minRuntime, maxRuntime) {
        const data = await this.makeApiCall(`/discover/movie?with_runtime.gte=${minRuntime}&with_runtime.lte=${maxRuntime}`);
        console.log(`Movies with runtime between ${minRuntime} and ${maxRuntime}:`, data.results);
        return data.results;
    }

    async getAllGenres() {
        const data = await this.makeApiCall('/genre/movie/list');
        return data.genres;
    }

    async getGenreId(genreName) {
        if (!genreName) {
            return null;
        }
        const genres = await this.getAllGenres();
        const genre = genres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
        return genre ? genre.id : null;
    }


    async getMoviesByGenre(genre) {
        console.log(genre)
        
        const genreId = await this.getGenreId(genre);
        console.log(genreId)
        if (!genreId) {
            throw new Error(`Genre "${genre}" not found`);
        }

        const data = await this.makeApiCall(`/discover/movie?with_genres=${genreId}`);
        console.log(data.results);
        return data.results;
    }

    async getMoviesByStartYear(year) {
        const data = await this.makeApiCall(`/discover/movie?primary_release_year=${year}`);
        return data.results;
    }

    async getMoviesByKeyword(keyword) {
        const data = await this.makeApiCall(`/search/movie?query=${keyword}`);
        console.log(data.results);
        const titlesWithDetails = await Promise.all(
            data.results.map(async (element) => {
                try {
                    const movie = await this.getMovieById(element.id);
                    return { ...element, ...movie };
                } catch (error) {
                    console.error(`Error fetching details for ${element.id}:`, error);
                    return element;
                }
            })
        );
        return titlesWithDetails;
    }

    async getImdbId(tmdbId) {
        const data = await this.makeApiCall(`/movie/${tmdbId}/external_ids`);
        return data.imdb_id;
    }

    async addToWatchlist(movieId) {
        console.log(`Movie with ID ${movieId} added to watchlist.`);
        return { success: true, movieId: movieId };
    }

}
