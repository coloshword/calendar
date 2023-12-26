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
                 <div className="day-grid"></div>
            </div>
        )
    }

    return (
        <div className="day-container">
            {renderDate()}
            {renderDayGrid()}
        </div>
    );
}

export { Day };