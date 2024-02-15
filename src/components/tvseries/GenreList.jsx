import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VITE_BASE_URL, VITE_TMDB_API_KEY } from '../../config';
import { Splide, SplideSlide } from '@splidejs/react-splide';

import '@splidejs/splide/dist/css/themes/splide-default.min.css';

const GenreList = () => {
    const [genres, setGenres] = useState([]);

    // Fetch all genres for tv series
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(`${VITE_BASE_URL}/genre/tv/list?api_key=${VITE_TMDB_API_KEY}`);
                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    return (
        <div className="container mx-auto pl-28 pr-28 pb-16 mt-20">
            <h3 className="text-2xl font-bold mb-6">TV Series Genres</h3>
            {/* Splide carousel to enhance genre navigation */}
            <Splide
                options={{
                    fixedWidth: 200,
                    isNavigation: true,
                    gap: 10,
                    pagination: false,
                    breakpoints: {
                        600: {
                            fixedWidth: 66,
                            fixedHeight: 40,
                        },
                    },
                }}
            >
                {genres.map((genre) => (
                    <SplideSlide key={genre.id}>
                        <Link to={`/tv/genre/${genre.id}`} className="text-white">
                            <div className="relative group bg-gray-800 rounded-md overflow-hidden shadow-lg h-full w-48">
                                <div className="h-full w-48 object-cover bg-gray-800 py-2 px-2 text-center">
                                    {genre.name}
                                </div>
                            </div>
                        </Link>
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    );
};

export default GenreList;