import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VITE_BASE_URL, VITE_TMDB_API_KEY } from '../../../config';
import MovieRecommendations from '../MovieRecommendations';
import CreditList from './CreditList';
import ImageList from './ImageList';
import VideoList from './VideoList';

const MovieDetails = () => {
    const { movieId } = useParams();
    const [details, setDetails] = useState({});

    // Fetch the details for a specific movie
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`${VITE_BASE_URL}/movie/${movieId}?api_key=${VITE_TMDB_API_KEY}`);
                const data = await response.json();
                setDetails(data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchDetails();
    }, [VITE_BASE_URL, VITE_TMDB_API_KEY, movieId]);

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
            <div className="flex items-center justify-center h-fit mt-40">
                <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-md flex flex-col md:flex-row custom-width mb-40">
                    <img
                        src={`https://image.tmdb.org/t/p/original/${details.poster_path}`}
                        alt={details.title}
                        className="w-60 h-70 object-cover mr-8 mb-4 md:mb-0 rounded-md select-none"
                    />
                    <div>
                        <h2 className="text-3xl font-bold">{details.title}</h2>
                        {details.vote_average && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold">Rating</h3>
                                <p className="text-2xl font-bold text-yellow-500 mb-3">{details.vote_average.toFixed(2)}/10</p>
                            </div>
                        )}
                        <div className="flex items-center mb-4">
                            <span className="text-gray-500">{formatDate(details.release_date)}</span>
                            <span className="mx-2">|</span>
                            <span className="text-gray-500">{details.runtime} min</span>
                        </div>
                        <p className="text-gray-700">{details.overview}</p>


                    </div>
                </div>
            </div>

            <CreditList movieId={movieId} />

            <ImageList movieId={movieId} />

            <VideoList movieId={movieId} />

            <MovieRecommendations movieId={movieId} />
        </>
    );
};

export default MovieDetails;