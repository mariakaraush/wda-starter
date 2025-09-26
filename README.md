# MovieFinder 🎬

A modern web application for discovering popular movies, managing your personal watchlist, and finding where to watch your favorite films online.

## Features

- **Browse Popular Movies**: View a curated list of popular films with details
- **Advanced Filtering**: Search by title, filter by genre, and sort by release date
- **Personal Watchlist**: Add movies to your personal watchlist with local storage
- **Movie Details**: View detailed information including cast, crew, and ratings
- **Streaming Services**: Find where to watch movies online
- **Accessibility**: Built with WCAG 2.1 AA compliance in mind
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Project Structure

```
wda-starter/
├── index.html              # Main homepage
├── views/
│   └── watchlist.html      # Watchlist management page
├── css/
│   └── style.css          # Main stylesheet with accessibility features
├── js/
│   ├── appData.js         # Alpine.js data and methods
│   ├── movies.js          # Movie API integration
│   ├── streamingServices.js # Streaming services API
│   └── scripts.js         # Module imports and window functions
└── assets/
    └── images/            # Logo and brand images
```


## Technologies Used

- **Frontend Framework**: [Alpine.js](https://alpinejs.dev/) for reactive UI
- **Styling**: Vanilla CSS with modern accessibility features
- **APIs**: 
  - IMDb API for movie data
  - Streaming Availability API for watch providers
- **Storage**: Local Storage for watchlist persistence
- **Module System**: ES6 modules

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wda-starter
   ```

2. **Serve the files**
   Since the project uses ES6 modules, you need to serve it from a web server:
   
   **Option 1: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option 2: Using Node.js**
   ```bash
   npx serve .
   ```
   
   **Option 3: Using VS Code Live Server**
   - Install the Live Server extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Open in browser**
   Navigate to `http://localhost:8000` (or the port shown by your server)

## API Configuration

### Movie Data API
The application uses `https://api.imdbapi.dev` for movie information. No API key required for basic usage.

### Streaming Services API
Uses RapidAPI's Streaming Availability service. To enable streaming data:

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the Streaming Availability API
3. Replace the API key in `js/streamingServices.js`:
   ```javascript
   this.api_key = "your-rapidapi-key-here";
   ```

## Features Overview

### Main Page (`index.html`)
- **Movie Discovery**: Browse popular movies with posters and details
- **Search & Filter**: Real-time search with genre and year filtering
- **Add to Watchlist**: One-click addition to personal watchlist
- **Movie Details**: Expandable slide panel with cast information

### Watchlist Page (`views/watchlist.html`)
- **Personal Collection**: View all saved movies
- **Remove Movies**: Easy removal from watchlist
- **Streaming Info**: Find where to watch each movie
- **Persistent Storage**: Uses browser local storage
## Accessibility Features

The application includes comprehensive accessibility support:

- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Skip Links**: Quick navigation for keyboard users
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Indicators**: Clear visual focus states
- **Live Regions**: Dynamic content announcements
## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 10.1+, Edge 16+
- **Requirements**: ES6 module support required
- **Mobile**: Responsive design works on iOS Safari and Android Chrome
## Development

### Adding New Features

1. **New API Endpoints**: Add methods to appropriate helper classes
2. **UI Components**: Extend the Alpine.js data object in `appData.js`
3. **Styling**: Add CSS to `style.css` following existing patterns
4. **Accessibility**: Ensure new features include proper ARIA attributes

### Code Organization

- **Data Management**: `appData.js` handles all application state
- **API Integration**: Separate classes for different API services
- **UI Logic**: Alpine.js directives in HTML templates
- **Styling**: Component-based CSS architecture
## Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Ensure you're serving from a web server (not file://)
   - Check browser console for CORS issues
   - Verify API endpoints are accessible

2. **Images not loading**
   - Check image URLs in API responses
   - Verify image paths are correct

3. **Watchlist not persisting**
   - Ensure local storage is enabled in browser
   - Check browser privacy settings

### Browser Console Debugging

Enable developer tools and check the console for:
- Network requests and responses
- JavaScript errors
- API rate limiting messages
## Contributing

1. Fork the repository
2. Create a feature branch
3. Ensure accessibility compliance
4. Test across different browsers
5. Submit a pull request

## License

This project is for educational purposes. Please respect API terms of service and rate limits.

---

**MovieFinder** - Find your next watch! 🍿