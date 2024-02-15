import { useEffect, useState } from 'react';
import { VITE_BASE_URL, VITE_TMDB_API_KEY } from '../../../config';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

const VideoList = ({ movieId }) => {
    const [videos, setVideos] = useState([]);

    // Fetch the videos for a specific movie
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch(`${VITE_BASE_URL}/movie/${movieId}/videos?api_key=${VITE_TMDB_API_KEY}`);
                const data = await response.json();
                setVideos(data.results);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();
    }, [movieId]);

    const noVideos = !videos || videos.length === 0;

    return (
        <div className="container mx-auto pl-32 pr-32 pb-32 mt-1">
            <h3 className="text-2xl font-bold mb-2">Videos</h3>
            {noVideos ? (
                <p className="text-black">No videos found for this movie.</p>
            ) : (
                <Splide options={{ perPage: 4, breakpoints: { 640: { perPage: 1 } } }}>
                    {videos.map((video) => (
                        <SplideSlide key={video.key} className="relative group select-none">
                            <iframe
                                title={video.name}
                                width="100%"
                                height="150"
                                src={`https://www.youtube.com/embed/${video.key}`}
                                allowFullScreen
                                className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
                            />
                        </SplideSlide>
                    ))}
                </Splide>
            )}
        </div>
    );
};

export default VideoList;