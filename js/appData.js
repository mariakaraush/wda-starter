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
        genres: [],
        releaseDates: [],
        selectedGenre: null,
        selectedReleaseDate: null,
        searchQuery: '',
        services: [],
        toastMessage: '',
        toastType: 'success',

        showToast(message, type = 'success') {
            this.toastMessage = message;
            this.toastType = type;

            setTimeout(() => this.hideToast(), 3000);

        },
        hideToast() {
            this.toastMessage = '';
        },
  

        async loadGenres(movies) {
            this.genres = movies.flatMap(movie => movie.genres || [])
                .filter((value, index, self) => self.indexOf(value) === index)
                .sort();
        },
        async loadReleaseDates(movies) {
            this.releaseDates = movies.map(movie => movie.startYear)
                .filter((value, index, self) => self.indexOf(value) === index)
                .sort((a, b) => b - a);
            console.log(this.releaseDates);
        },
        async loadMovieData() {
            this.allMovies = await loadMovies();
            this.movies = this.allMovies;
            this.loadGenres(this.allMovies);
            this.loadReleaseDates(this.allMovies);
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
                this.applyFilters();
            });
            this.applyFilters();
        },

        applyFilters() {
            let filteredMovies = this.allMovies;

            if (this.selectedGenre) {
                filteredMovies = filteredMovies.filter(movie => movie.genres && movie.genres.includes(this.selectedGenre));
                this.loadReleaseDates(filteredMovies);
            }
            
            if (this.selectedReleaseDate) {
                filteredMovies = filteredMovies.filter(movie => movie.startYear == this.selectedReleaseDate);
                this.loadGenres(filteredMovies);
            } 
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filteredMovies = filteredMovies.filter(movie => 
                    (movie.primaryTitle && movie.primaryTitle.toLowerCase().includes(query)) || 
                    (movie.plot && movie.plot.toLowerCase().includes(query)));
            }

            this.movies = filteredMovies;
        },
        

        async getMovieCredits(movieId) {
            this.selectedMovie = this.movies.find(movie => movie.id === movieId)
            this.showSlide = true
            this.credits = await window.getMovieCredits(movieId);
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
        addToWatchlist(movieId) {
            const saveMovies = localStorage.getItem('watchlist');
            let watchlist = saveMovies ? JSON.parse(saveMovies) : [];

            const exists = watchlist.some(movie => movie.id === movieId);
            if (!exists) {
                const movie = this.allMovies.find(m => m.id === movieId);
                watchlist.push(movie);
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

                this.services = await window.getStreamingServices(movieId);
                console.log(this.services);
            } catch (error) {
                console.error('Error fetching streaming services:', error);
                this.services = null;
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
    }
}