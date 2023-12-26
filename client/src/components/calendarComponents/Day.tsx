import React, { FC, useState } from 'react';
import '../calendarCSS/Day.css';

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SUN"];
// Define the props type
interface DayProps {
    day: Date;
    today: Date
}

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

    return (
        <div className="day-container">
            {renderDate()}
        </div>
    );
}

export { Day };