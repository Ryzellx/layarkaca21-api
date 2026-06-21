"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoviesByGenre = exports.getGenres = void 0;
const getGenres = async (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 'action', name: 'Action', slug: 'action' },
            { id: 'adventure', name: 'Adventure', slug: 'adventure' },
            { id: 'animation', name: 'Animation', slug: 'animation' },
            { id: 'biography', name: 'Biography', slug: 'biography' },
            { id: 'comedy', name: 'Comedy', slug: 'comedy' },
            { id: 'crime', name: 'Crime', slug: 'crime' },
            { id: 'documentary', name: 'Documentary', slug: 'documentary' },
            { id: 'drama', name: 'Drama', slug: 'drama' },
            { id: 'family', name: 'Family', slug: 'family' },
            { id: 'fantasy', name: 'Fantasy', slug: 'fantasy' },
            { id: 'history', name: 'History', slug: 'history' },
            { id: 'horror', name: 'Horror', slug: 'horror' },
            { id: 'musical', name: 'Musical', slug: 'musical' },
            { id: 'mystery', name: 'Mystery', slug: 'mystery' },
            { id: 'romance', name: 'Romance', slug: 'romance' },
            { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' },
            { id: 'sport', name: 'Sport', slug: 'sport' },
            { id: 'thriller', name: 'Thriller', slug: 'thriller' },
            { id: 'war', name: 'War', slug: 'war' },
            { id: 'western', name: 'Western', slug: 'western' }
        ]
    });
};
exports.getGenres = getGenres;
const getMoviesByGenre = async (req, res) => {
    res.json({
        success: true,
        page: 1,
        total: 0,
        data: []
    });
};
exports.getMoviesByGenre = getMoviesByGenre;
