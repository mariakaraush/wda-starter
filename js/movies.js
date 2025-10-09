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

    async filterMoviesByYearOrGenre(startYear = null, genre = null) {
        if(!startYear) {
            return await this.getMoviesByGenre(genre);
        } else if (!genre) {
            return await this.getMoviesByStartYear(startYear);
        } else {
            const url = `${this.api_root}/titles?types=MOVIE&genres=${genre}&startYear=${startYear}&endYear=${startYear}`;

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
        const url = `${this.api_root}/titles?types=MOVIE&startYear=${year}&endYear=${year}`;

        console.log(url);
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
        const titlesWithDetails = await Promise.all(
            data.titles.map(async (element) => {
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

    async addToWatchlist(movieId) {
        console.log(`Movie with ID ${movieId} added to watchlist.`);
        return { success: true, movieId: movieId };
    }

}
