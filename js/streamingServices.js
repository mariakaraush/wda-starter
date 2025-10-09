export default class StreamingServiceHelper {
    
    constructor() {
        this.api_root = "https://streaming-availability.p.rapidapi.com";
        this.api_key = "fdbf121165mshda1692bcfbf5319p1d434djsn64b7ffe0a67f";
    }

    async getStreamingServices(movieId) {

        const response = await fetch(`${this.api_root}/shows/${movieId}`, {
            headers: {
                'x-rapidapi-key': this.api_key,
                'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
                'Content-Type': 'application/json'            
            }
        }); 
        if (!response.ok) {
            throw new Error('Failed to fetch streaming services');
        }
        const data = await response.json();
        const services = data.streamingOptions;

        const streamingService = this.getFirstStreamingOption(services);
        console.log(streamingService);
        return streamingService;
    }

    getFirstStreamingOption(streamingOptions) {
        const countryArray = Object.values(streamingOptions);

        for (const country of countryArray) {
            if(country && country.length > 0) {
                return country[0];
            }
        }
        return null;
    }
}   
