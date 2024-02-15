import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VITE_BASE_URL, VITE_TMDB_API_KEY } from '../../config';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [sortOrder, setSortOrder] = useState(null); // Initially, no preselected value
    const [moviesToDisplay, setMoviesToDisplay] = useState(12); // State to track the number of movies to display

    // Fetch top rated movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(`${VITE_BASE_URL}/movie/top_rated?api_key=${VITE_TMDB_API_KEY}`);
                const data = await response.json();

                // Check if sortOrder is set before sorting
                const sortedMovies = sortOrder ?
                    data.results.sort((a, b) => {
                        if (sortOrder === 'ascTitle') {
                            return a.title.localeCompare(b.title);
                        } else if (sortOrder === 'descTitle') {
                            return b.title.localeCompare(a.title);
                        } else if (sortOrder === 'ascRating') {
                            return a.vote_average - b.vote_average;
                        } else if (sortOrder === 'descRating') {
                            return b.vote_average - a.vote_average;
                        } else if (sortOrder === 'newestFirst') {
                            return new Date(b.release_date) - new Date(a.release_date);
                        } else if (sortOrder === 'oldestFirst') {
                            return new Date(a.release_date) - new Date(b.release_date);
                        }
                    })
                    : data.results;

                setMovies(sortedMovies);
            } catch (error) {
                console.error('Error fetching top-rated movies:', error);
            }
        };

        fetchMovies();
    }, [VITE_BASE_URL, VITE_TMDB_API_KEY, sortOrder]);

    const handleSortChange = (selectedSortOrder) => {
        setSortOrder(selectedSortOrder);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="container mx-auto p-28 mt-1">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold">Top Movies</h3>
                <div className="flex">
                    <Link to="/movies" className="text-gray-700 hover:underline ml-2 more-movies">View More</Link>
                </div>

                {/* Sorting dropdown */}
                <div className="relative top-2">
                    <select
                        id='sortDropdown'
                        className="mb-4 p-2 pr-10 border border-gray-300 rounded appearance-none focus:outline-none focus:shadow-outline cursor-pointer"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%232c3e50\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpath d=\'M19 9l-7 7-7-7\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                        value={sortOrder || ''}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="">Highest Rated First</option>
                        <option value="ascRating">Lowest Rated First</option>
                        <option value="ascTitle">Title: A-Z</option>
                        <option value="descTitle">Title: Z-A</option>
                        <option value="newestFirst">Newest First</option>
                        <option value="oldestFirst">Oldest First</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.slice(0, moviesToDisplay).map((movie) => (
                    <Link to={`/movie/${movie.id}`} key={movie.id} className="text-white">
                        <div className="relative group bg-gray-800 rounded-md overflow-hidden shadow-lg h-full">
                            <img
                                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105 select-none"
                            />
                            <div className="absolute inset-0 flex flex-col items-start justify-end bg-black opacity-0 group-hover:opacity-70 transition-opacity p-4">
                                <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                                <div className="flex items-center">
                                    <p className="text-gray-400">{formatDate(movie.release_date)}</p>
                                    <p className="text-xl font-bold text-yellow-500 mb-3 ml-4 average-rating">
                                        {movie.vote_average.toFixed(2)}/10
                                    </p>
                                </div>
                                <p className="mt-2 text-white">{movie.overview.slice(0, 150)}...</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div >
    );
};

export default MovieList;