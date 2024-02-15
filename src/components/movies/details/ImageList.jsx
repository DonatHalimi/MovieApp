import React, { useEffect, useState } from 'react';
import { VITE_BASE_URL, VITE_TMDB_API_KEY } from '../../../config';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

const ImageList = ({ movieId }) => {
    const [images, setImages] = useState([]);

    // Fetch the images for a specific movie
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${VITE_BASE_URL}/movie/${movieId}/images?api_key=${VITE_TMDB_API_KEY}`);
                const data = await response.json();
                setImages(data.backdrops);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, [movieId]);

    const noImages = !images || images.length === 0;

    return (
        <div className="container mx-auto pl-32 pr-32 pb-32 mt-1">
            <h3 className="text-2xl font-bold mb-2">Images</h3>
            {noImages ? (
                <p className="text-black">No image found for this movie.</p>
            ) : (
                <Splide options={{ perPage: 4, breakpoints: { 640: { perPage: 1 } } }}>
                    {images.map((image) => (
                        <SplideSlide key={image.file_path}>
                            <div className="relative group select-none">
                                <img
                                    src={`https://image.tmdb.org/t/p/original/${image.file_path}`}
                                    alt="Backdrop"
                                    className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
                                />
                            </div>
                        </SplideSlide>
                    ))}
                </Splide>
            )}
        </div>
    );
};

export default ImageList;