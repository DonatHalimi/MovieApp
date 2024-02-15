import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { VITE_BASE_URL, VITE_TMDB_API_KEY } from '../../config';

const TVSeriesRecommendations = () => {
    const { tvSeriesId } = useParams();
    const [recommendations, setRecommendations] = useState([]);
    const [showMore, setShowMore] = useState(false);

    // Fetch recommended tv series
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch(`${VITE_BASE_URL}/tv/${tvSeriesId}/recommendations?api_key=${VITE_TMDB_API_KEY}`);
                const data = await response.json();
                setRecommendations(data.results);
            } catch (error) {
                console.error('Error fetching TV series recommendations:', error);
            }
        };

        // Scroll to top when the component mounts
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // Reset showMore when movieId changes
        setShowMore(false);

        fetchRecommendations();
    }, [VITE_BASE_URL, VITE_TMDB_API_KEY, tvSeriesId]);

    const handleClick = () => {
        setShowMore(true);
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
        <div className="container mx-auto pl-32 pr-32 pb-32">
            <h3 className="text-2xl font-bold mb-4">Recommended TV Series</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendations.slice(0, showMore ? recommendations.length : 9).map((series) => (
                    <Link to={`/tv/${series.id}`} key={series.id} className="text-white">
                        <div className="relative group bg-gray-800 rounded-md overflow-hidden shadow-lg h-full">
                            <img
                                src={`https://image.tmdb.org/t/p/original/${series.poster_path}`}
                                alt={series.name}
                                className="w-70 h-30 object-cover transition-transform duration-300 transform group-hover:scale-105 select-none"
                            />
                            <div className="absolute inset-0 flex flex-col items-start justify-end bg-black opacity-0 group-hover:opacity-70 transition-opacity p-4">
                                <h3 className="text-xl font-bold text-white">{series.name}</h3>
                                <div className="flex items-center">
                                    <p className="text-gray-400">{formatDate(series.first_air_date)}</p>
                                    <p className="text-xl font-bold text-yellow-500 mb-3 ml-4 average-rating">
                                        {series.vote_average.toFixed(2)}/10
                                    </p>
                                </div>
                                <p className="mt-2 text-white">{series.overview.slice(0, 150)}...</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {!showMore && recommendations.length > 9 && (
                <div className="flex justify-center mt-4">
                    <Button
                        onClick={handleClick}
                        variant="contained"
                        sx={{
                            backgroundColor: '#1F2937',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#161E2E',
                            },
                        }}
                    >
                        Show More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TVSeriesRecommendations;