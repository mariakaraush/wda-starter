
export default class StreamingServiceHelper {
    
    constructor() {
        this.api_root = "https://api.themoviedb.org/3";
        this.api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZDUyMTc4MjU3MmY2MTdiYmE1OWJhZTdiOTZmZGM4ZSIsIm5iZiI6MTc1NjgxOTQzNy40NjMsInN1YiI6IjY4YjZlZmVkYWVkYWMwOWY5ODIwMTYwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wtJvoe2Yl5p3qg8yW-YfKaE41pNS3cx1mbnkEK2OMqI";
    }

    async getStreamingServices(movieId) {

        const url = `${this.api_root}/movie/${movieId}/watch/providers`;

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
        const services = data.results;

        const streamingService = this.getFirstStreamingOption(services);

        if (!streamingService) {
            return [];
        }
        const detailedServices = this.getServicesWithDetails(streamingService);
        return detailedServices;
    }

    getFirstStreamingOption(streamingOptions) {

        if (streamingOptions.GB) {
            return streamingOptions.GB;
        }

        if (streamingOptions.US) {
            return streamingOptions.US;
        }

        const countryArray = Object.values(streamingOptions);

        for (const country of countryArray) {
            if(country && country.length > 0) {
                return country[0];
            }
        }
        return null;
    }

    getServicesWithDetails(data) {
        const services = [];
        const watchLink = data.link;

        if (data.rent && Array.isArray(data.rent)) {
            data.rent.forEach(service => {
                services.push({
                    provider_id: service.provider_id,
                    provider_name: service.provider_name,
                    logo_path: service.logo_path,
                    link: watchLink
                });
            });
        }

        return services;
    }

}   
