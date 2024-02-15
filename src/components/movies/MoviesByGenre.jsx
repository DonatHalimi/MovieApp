import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { VITE_BASE_URL, VITE_TMDB_API_KEY } from '../../config';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const MoviesByGenre = () => {
    const { genreId } = useParams();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [genres, setGenres] = useState({});
    const [sortOrder, setSortOrder] = useState(null);

    // Fetch the Movies list for a specific genre
    useEffect(() => {
        const fetchMoviesByGenre = async () => {
            try {
                // Fetch genre details to get the genre name
                const genreResponse = await fetch(`${VITE_BASE_URL}/genre/movie/list?api_key=${VITE_TMDB_API_KEY}`);
                const genreData = await genreResponse.json();
                const genresMap = {};
                genreData.genres.forEach((genre) => {
                    genresMap[genre.id] = genre.name;
                });
                setGenres(genresMap);

                // Fetch movies by genre
                const response = await fetch(`${VITE_BASE_URL}/discover/movie?api_key=${VITE_TMDB_API_KEY}&with_genres=${genreId}&page=${currentPage + 1}`);
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
                console.error('Error fetching movies by genre:', error);
            }
        };

        fetchMoviesByGenre();
    }, [VITE_BASE_URL, VITE_TMDB_API_KEY, genreId, currentPage, sortOrder]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

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

    const goBack = () => {
        navigate(-1);
    };

    const genreName = genres[genreId] || '';

    return (
        <div className="container mx-auto pl-28 pr-28 pb-28 mt-20">
                        <button
                className="flex items-center bg-gray-200 hover:bg-gray-300 hover:transition-all text-gray-700 font-bold py-2 px-4 rounded-full circle-button cursor-pointer relative top-6"
                onClick={goBack}>
                <ArrowBackRoundedIcon />
            </button>
            <h3 className="text-2xl font-bold relative top-10 w-42">{genreName} Movies</h3>

            {/* Sorting dropdown */}
            <div className="dropdown-sorting">
                <select
                    id='sortDropdown'
                    className="mb-4 p-2 pr-10 border border-gray-300 rounded appearance-none focus:outline-none focus:shadow-outline cursor-pointer"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%232c3e50\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpath d=\'M19 9l-7 7-7-7\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                    value={sortOrder || ''}
                    onChange={(e) => handleSortChange(e.target.value)}>
                    <option value="">By Relevance</option>
                    <option value="ascTitle">Title: A-Z</option>
                    <option value="descTitle">Title: Z-A</option>
                    <option value="ascRating">Lowest Rated First</option>
                    <option value="descRating">Highest Rated First</option>
                    <option value="newestFirst">Newest First</option>
                    <option value="oldestFirst">Oldest First</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
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
            
            {/* Pagination */}
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={<span className="break-me">...</span>}
                breakClassName={'break-me'}
                pageCount={100}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={'pagination flex justify-center mt-20'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                activeLinkClassName={'pagination-link'}
                pageClassName={'pagination-link'}
                previousClassName={'pagination-link previous'}
                nextClassName={'pagination-link next'}
                disabledClassName={'pagination-link disabled'}
                disableInitialCallback={true}
            />
        </div>
    );
};

export default MoviesByGenre;