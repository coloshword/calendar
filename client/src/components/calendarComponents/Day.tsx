import React, { FC, useState } from 'react';
import '../calendarCSS/Day.css';

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
// Define the props type
interface DayProps {
    day: Date;
    today: Date
}

/* Day: component that renders a "day" of the calendar --> specifically in day mode */
const Day: FC<DayProps> = ({ day, today }) => {
    /* renderDate: renders the display of day of the week and the date (of the month) */
    const renderDate = () => {
        return (
            <div className="day-date-container">
                <span>{dayNames[day.getDay()]}</span>
                <div className={(day.toDateString() == today.toDateString() ? "day-date-today" : "") + " day-date-circle"}>
                    {day.getDate()}
                </div>
            </div>
        )
    }

    /* renderDayGrid: renders the visual "grid" that represents a day */
    const renderDayGrid = () => {
        return (
            <div className="day-grid-container">
                 <div className="day-grid">
                    {/* Create 24 inner divs, representing "hours"*/}
                    {Array.from({length: 24}, (_, i) => i).map(num => ( 
                        <div key={num} className="day-hour-section">
                            {num < 12 ? <pre className="time-text"> {num == 0 ? 12 : num} AM </pre> : <pre className="time-text"> {(num - 12) == 0 ? 12 : num - 12 } PM </pre>}
                            <hr className="hour-line"></hr>
                        </div>
                    ))}
                 </div>
            </div>
        )
    }

    return (
        <div className="day-container unselectable">
            {renderDate()}
            {renderDayGrid()}
        </div>
    );
}

export { Day };