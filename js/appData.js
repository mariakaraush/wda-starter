

export function appData() {
    return {
        movies: [],
        allMovies: [],
        watchlist: [],
        error: null,
        selectedMovie: null,
        credits: null,
        showSlide: false,
        whereToWatchSlide: false,
        loading: false,
        openDropdown: false,
        selectedGenre: null,
        selectedReleaseDate: null,
        searchQuery: '',
        services: [],
        runtimeMin: null,
        runtimeMax: null,
        toastMessage: '',
        toastType: 'success',
        staticYears: Array.from({length: 76}, (_, i) => 2025 - i),
        staticGenres: [
            'Action',
            'Adventure',
            'Animation',
            'Comedy',
            'Crime',
            'Documentary',
            'Drama',
            'Family',
            'Fantasy',
            'History',
            'Horror',
            'Music',
            'Mystery',
            'Romance',
            'Science Fiction',
            'Thriller',
            'War',
            'Western'
        ],

        showToast(message, type = 'success') {
            this.toastMessage = message;
            this.toastType = type;

            setTimeout(() => this.hideToast(), 3000);

        },
        hideToast() {
            this.toastMessage = '';
        },
  

    
        async loadMovieData() {
            this.allMovies = await loadMovies();
            this.movies = this.allMovies;

            this.loadWatchlist();
        },

        filterMovies() {
            this.$watch('selectedGenre', () => {
                this.applyFilters();
            });
            this.$watch('selectedReleaseDate', () => {
                this.applyFilters();
            });
            this.$watch('searchQuery', () => {
                this.timedSearch();
            });
            
            this.applyFilters();
        },

        timedSearch() {
            if(this.searchTimeout) clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.applyFilters();
            }, 500);
        },

        async applyFilters() {
            let filteredMovies = this.allMovies;

            if (this.selectedGenre || this.selectedReleaseDate || (this.runtimeMin && this.runtimeMax)) {
                filteredMovies = await filterMoviesByYearOrGenreOrByRunTime(this.selectedReleaseDate, this.selectedGenre, this.runtimeMin, this.runtimeMax);
            }
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filteredMovies = await getMoviesByKeyword(query);
            } 
            
            this.movies = filteredMovies;
        },

        clearRuntimeFilters() {
            this.runtimeMin = null;
            this.runtimeMax = null;
            this.selectedReleaseDate = null;
            this.selectedGenre = null;
            this.applyFilters();
        },


         async getMovieDetailsAndCredits(movie) {
            let movieId = await this.getImdbId(movie.id);

            this.selectedMovie = await getMovieById(movieId);
            this.credits = await getMovieCredits(movieId);
            console.log(this.credits);
            this.showSlide = true;
        },

        closeSlide() {
            this.showSlide = false;
            this.selectedMovie = null;
        },

        closeWhereToWatchSlide() {
            this.whereToWatchSlide = false;
            this.selectedMovie = null;
            this.services = null;
        },

        loadWatchlist(){
            const savedMovies = localStorage.getItem('watchlist');
            this.watchlist = savedMovies ? JSON.parse(savedMovies) : [];
            return this.watchlist;
        },
        async isInWatchlist(movieId) {
            const id = await this.getImdbId(movieId);
            console.log(id);
            return this.watchlist.some(movie => movie.id === id);
        },

        isMovieInWatchlistSync(movie) {
         
 
                return this.watchlist.some(watchlistMovie => watchlistMovie.id === movie.id);
       
        },

        async getImdbId(movieId) {
            if (this.movies.length > 0) {
                return await getImdbId(movieId);
            } else {
                return movieId;
            }
        },

        async addToWatchlist(movieId) {
            const id = await this.getImdbId(movieId);
            const saveMovies = localStorage.getItem('watchlist');
            let watchlist = saveMovies ? JSON.parse(saveMovies) : [];

            if (!await this.isInWatchlist(movieId)) {
                this.selectedMovie = await getMovieById(id);
                watchlist.push(this.selectedMovie);
                localStorage.setItem('watchlist', JSON.stringify(watchlist));
                this.showToast('Movie added to watchlist! 🎬', 'success');
                this.loadWatchlist();
            } else {
                this.showToast('Movie is already in your watchlist.⚠️', 'warning');
            }
        },

        removeFromWatchlist(id) {
            const savedMovies = localStorage.getItem('watchlist');
            let watchlist = savedMovies ? JSON.parse(savedMovies) : [];

            watchlist = watchlist.filter(movie => movie.id !== id);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            this.showToast('Movie removed from watchlist. 🗑️', 'success');
            this.loadWatchlist();
        },

        async loadServices(movieId) {
            try {
                this.selectedMovie = this.watchlist.find(movie => movie.id === movieId);
                this.whereToWatchSlide = true;

                this.services = await getStreamingServices(movieId);
                console.log(this.services);
            } catch (error) {
                console.error('Error fetching streaming services:', error);
            }
        },

        handleKeydown(event) {
            if (event.key === 'Escape') {
                if (this.showSlide) {
                    this.closeSlide();
                }
                if (this.whereToWatchSlide) {
                    this.closeWhereToWatchSlide();
                }
            }
        },

        getGenresDisplay(movie) {
            if (!movie.genres || !Array.isArray(movie.genres)) {
                return 'No genres available';
            }
            return movie.genres.length > 0 ? movie.genres.join(', ') : 'No genres available';
        },

         getMovieTitle(movie) {
            return movie.primaryTitle || movie.title || movie.original_title || 'Unknown Title';
        },

        getMovieOverview(movie) {
            return movie.plot || movie.overview || '';
        },

        getMovieYear(movie) {
            if (movie.startYear) return movie.startYear;
            if (movie.release_date) return new Date(movie.release_date).getFullYear();
            return 'Unknown';
        },

        getMoviePoster(movie) {
            if (movie.primaryImage?.url) return movie.primaryImage.url;
            if (movie.poster_path) return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            return './assets/images/no_poster_image.jpg'; // fallback image
        },

        getMovieGenres(movie) {
            if (movie.genres && Array.isArray(movie.genres)) {
                return movie.genres.map(genre => genre.name).join(', ');
            }
            if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
                console.log(movie.genre_ids);
                return this.mapGenreIds(movie.genre_ids);
            }
            return '';
        },

        getRuntime(movie) {
            if (movie.runtime) {
                return movie.runtime;
            }
            return 'N/A';

        },

        mapGenreIds(genreIds) {
            const genreMap = {
                28: 'Action', 35: 'Comedy', 18: 'Drama', 27: 'Horror',
                878: 'Science Fiction', 53: 'Thriller', 80: 'Crime',
                12: 'Adventure', 16: 'Animation', 14: 'Fantasy',
                36: 'History', 10402: 'Music', 9648: 'Mystery',
                10749: 'Romance', 10751: 'Family', 10752: 'War',
                37: 'Western', 99: 'Documentary'
            };
            return genreIds.map(id => genreMap[id]).filter(Boolean).join(', ');
        },

        getCurrentMovieCount() {
            return this.movies.length;
        },

    }
}
window.appData = appData;