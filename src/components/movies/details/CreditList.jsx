import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { VITE_BASE_URL, VITE_TMDB_API_KEY } from '../../../config';

const CreditList = ({ movieId }) => {
    const [credits, setCredits] = useState([]);
    const [showMore, setShowMore] = useState(false);

    // Fetch the credits for a specific movie
    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const response = await fetch(`${VITE_BASE_URL}/movie/${movieId}/credits?api_key=${VITE_TMDB_API_KEY}`);
                const data = await response.json();
                setCredits(data.cast);
            } catch (error) {
                console.error('Error fetching credits:', error);
            }
        };

        // Reset showMore when movieId changes
        setShowMore(false);

        // Fetch credits of a movie
        fetchCredits();
    }, [movieId]);

    // Show more movies when clicking on 'Show more' button
    const handleClick = () => {
        setShowMore(true);
    };

    const noCredits = !credits || credits.length === 0;

    return (
        <div className="container mx-auto pl-32 pr-32 pb-32">
            <h3 className="text-2xl font-bold mb-4">Credits</h3>
            {noCredits ? (
                <p className="text-black">No credits found for this movie.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                    {credits.slice(0, showMore ? credits.length : 9).map((castMember) => (
                        <div key={castMember.id} className="flex items-center mb-4">
                            <div>
                                <p className="font-bold hover:underline">
                                    {/* Make actor's name clickable with a link to search on Google with proper URI encoding */}
                                    <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(castMember.name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {castMember.name}
                                    </a>
                                </p>
                                {/* Make actor's character clickable with a link to search on Google with proper URI encoding */}
                                <p className="text-gray-500 hover:underline">
                                    <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(castMember.character)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {castMember.character}
                                    </a>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {(!noCredits && credits.length > 9 && !showMore) && (
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

export default CreditList;