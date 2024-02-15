import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../Logo.png';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="bg-gray-800 p-4 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-lg font-bold">
                    <img src={Logo} className='logo' alt="Logo" />
                </Link>

                <div className="flex space-x-4 items-center">
                    <Link to={'/movies'} className={`navbar-link font-semibold text-gray-100 ${location.pathname === '/movies' && 'navbar-link-active'}`}>
                        Movies
                    </Link>
                    <Link to={'/tv-series'} className={`navbar-link font-semibold text-gray-100 ${location.pathname === '/tv-series' && 'navbar-link-active'}`}>
                        TV Series
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
