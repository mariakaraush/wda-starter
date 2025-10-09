export default class RunTimeApi {

    constructor() {
        this.api_root = "https://api.themoviedb.org/3";
        this.api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZDUyMTc4MjU3MmY2MTdiYmE1OWJhZTdiOTZmZGM4ZSIsIm5iZiI6MTc1NjgxOTQzNy40NjMsInN1YiI6IjY4YjZlZmVkYWVkYWMwOWY5ODIwMTYwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wtJvoe2Yl5p3qg8yW-YfKaE41pNS3cx1mbnkEK2OMqI";
    }

    async getMoviesWithRuntime(minRuntime, maxRuntime) {
        const url = `${this.api_root}/discover/movie?with_runtime.gte=${minRuntime}&with_runtime.lte=${maxRuntime}`;
        
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.api_key}`
            }
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        console.log(data.results);
        return data.results;
    }

    async getImdbId(tmdbId) {
        const url = `${this.api_root}/movie/${tmdbId}/external_ids`;
        
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.api_key}`
            }
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch IMDb ID');
        }
        const data = await response.json();
        return data.imdb_id;
    }
}