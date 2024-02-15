import React, { useEffect, useState } from 'react'

export const ToTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    // useEffect to track scroll position and control visibility based on the vertical scroll distance
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Function to smoothly scroll to the top of the page
    const scrollToTop = () => {
        const currentScroll = document.documentElement.scrollTop || document.body.scrollTop

        if (currentScroll > 0) {
            window.requestAnimationFrame(scrollToTop)
            window.scrollTo(0, currentScroll - currentScroll / 11)
        }
    }

    const buttonStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        height: '50px',
        width: '60px',
        backgroundColor: '#4B5563',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
    }

    const arrowStyle = {
        width: '20px',
        height: '20px',
    }

    return (
        <div>
            {isVisible && (
                <button onClick={scrollToTop} style={buttonStyle}>
                    <FontAwesomeIcon style={arrowStyle} />
                </button>
            )}
        </div>
    )
}