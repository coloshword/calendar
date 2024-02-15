import React, { useState, useEffect, FC } from 'react';
import '../calendarCSS/ErrorDisplay.css';

interface ErrorDisplayProps {
    msg: string;
    setMsg: Function
}

/** ErrorDisplay: component to display any basic error */
export const ErrorDisplay: FC<ErrorDisplayProps> = ({ msg, setMsg }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); 

        return () => clearTimeout(timer);
    }, []); 

    if (!visible) return null; 

    return (
        <div className="error-display-container">
            <span className="error-text">{msg}</span>
        </div>
    );
};
