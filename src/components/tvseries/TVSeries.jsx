import ReactPaginate from 'react-paginate';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VITE_BASE_URL, VITE_TMDB_API_KEY } from '../../config';
import GenreList from './GenreList';

const TVSeries = () => {
    const [series, setSeries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOrder, setSortOrder] = useState(null);

    // Fetch most popular tv series
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${VITE_BASE_URL}/tv/popular?api_key=${VITE_TMDB_API_KEY}&page=${currentPage + 1}`);
                const data = await response.json();

                // Check if sortOrder is set before sorting
                const sortedSeries = sortOrder
                    ? data.results.sort((a, b) => {
                        if (sortOrder === 'ascTitle') {
                            return a.name.localeCompare(b.name);
                        } else if (sortOrder === 'descTitle') {
                            return b.name.localeCompare(a.name);
                        } else if (sortOrder === 'ascRating') {
                            return a.vote_average - b.vote_average;
                        } else if (sortOrder === 'descRating') {
                            return b.vote_average - a.vote_average;
                        } else if (sortOrder === 'newestFirst') {
                            return new Date(b.first_air_date) - new Date(a.first_air_date);
                        } else if (sortOrder === 'oldestFirst') {
                            return new Date(a.first_air_date) - new Date(b.first_air_date);
                        }
                    })
                    : data.results;

                setSeries(sortedSeries);

            } catch (error) {
                console.error('Error fetching TV series:', error);
            }
        };

        // Scroll to top when the component mounts
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        fetchData();
    }, [VITE_BASE_URL, VITE_TMDB_API_KEY, currentPage, sortOrder]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleSortChange = (selectedSortOrder) => {
        setSortOrder(selectedSortOrder);
    };

    // Format the release date in DD/MM/YYYY format to be more readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <GenreList />
            <div className="container mx-auto pl-28 pr-28 pb-28">
                <h3 className="text-2xl font-bold relative top-10 w-42">Popular TV Series</h3>

                <div className="dropdown-sorting">
                    <select
                        id='sortDropdown'
                        className="mb-4 p-2 pr-10 border border-gray-300 rounded appearance-none focus:outline-none focus:shadow-outline cursor-pointer"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%232c3e50\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpath d=\'M19 9l-7 7-7-7\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                        value={sortOrder || ''}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
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
                    {series.map((series) => (
                        <Link to={`/tv/${series.id}`} key={series.id} className="text-white">
                            <div className="relative group bg-gray-800 rounded-md overflow-hidden shadow-lg h-full">
                                <img
                                    src={`https://image.tmdb.org/t/p/original/${series.poster_path}`}
                                    alt={series.name}
                                    className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105 select-none"
                                />
                                <div className="absolute inset-0 flex flex-col items-start justify-end bg-black opacity-0 group-hover:opacity-70 transition-opacity p-4">
                                    <h3 className="text-xl font-bold text-white">{series.name}</h3>
                                    <div className="flex items-center">
                                        <p className="text-gray-400">{formatDate(series.first_air_date)}</p>
                                        <p className="text-xl font-bold text-yellow-500 mb-3 ml-4 average-rating">
                                            {series.vote_average}/10
                                        </p>
                                    </div>
                                    <p className="mt-2 text-white">{series.overview.slice(0, 150)}...</p>
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
        </>
    );
};

export default TVSeries;