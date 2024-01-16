import '../calendarCSS/MiniCalendar.css';
import { useState, useEffect, FC } from 'react';

interface MiniCalendarProps {
    today: Date;
}
const MiniCalendar: FC<MiniCalendarProps> = ({today}) => {
    const [viewDate, setViewDate] = useState(today);

    const monthNames= ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
    return (
        <div className="mini-calendar-container">
            <div className="mini-calendar-header">
                <span className="mini-calendar-header-month"> {monthNames[viewDate.getMonth()]}</span>
            </div>
        </div>
    )
}

export { MiniCalendar }