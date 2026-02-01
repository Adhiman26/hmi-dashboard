import React, { useEffect, useState } from 'react';
import './Header.css';

const Header: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="header-container">
            <div className="header-left">
                <span className="header-date">{formatDate(currentTime)}</span>
                <span className="header-time">{formatTime(currentTime)}</span>
            </div>

            <div className="header-center">
                {/* Placeholder for Machine ID or Title if needed */}
            </div>

            <div className="header-right">
                <span className="header-item">24.1V</span>
                <span className="header-item">4G</span>
                <span className="header-item">GPS</span>
            </div>
        </div>
    );
};

export default Header;
