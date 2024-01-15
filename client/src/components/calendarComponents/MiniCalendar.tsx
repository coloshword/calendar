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
            <span> {monthNames[viewDate.getMonth()] + " " + viewDate.getFullYear()}  </span>
        </div>
    )
}

export { MiniCalendar }