import '../calendarCSS/MiniCalendar.css';
import { useState, useEffect, FC } from 'react';
import arrowLeft from '../../assets/arrow-left.svg';
import arrowRight from '../../assets/arrow-right.svg';

interface MiniCalendarProps {
    today: Date;
}
const MiniCalendar: FC<MiniCalendarProps> = ({today}) => {

    const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    /* getFirstAndLast: returns the first and last day of the month */
    function getFirstAndLast(date: Date) : Date[]{
        let year = date.getFullYear();
        let month = date.getMonth();
        let first: Date = new Date(year, month, 1);
        let last: Date = new Date(year, month + 1, 0);
        return [first, last];
    }

    /* handleNextMonth: event handler to get the next month */
    function handleNextMonth() : void {
        let nextMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
        setViewMonth(nextMonth);
    }

    /* handlePrevMonth: event handler to get the prev month */
    function handlePrevMonth() : void {
        let prevMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
        setViewMonth(prevMonth);
    }

    function loadCalendarGrid() {
        console.log(getFirstAndLast(viewMonth)[0]);
        console.log(getFirstAndLast(viewMonth)[1]);
        return (
            <table className="mini-calendar-grid">
            <tr>
                <td className="week-cell"> S </td>
                <td className="week-cell"> M </td>
                <td className="week-cell"> T </td>
                <td className="week-cell"> W </td>
                <td className="week-cell"> T </td>
                <td className="week-cell"> F </td>
                <td className="week-cell"> S </td>
            </tr>
            <tr>b</tr>
            <tr>b</tr>
            <tr>b</tr>
            <tr>b</tr>
            <tr>b</tr>
            <tr>b</tr>
        </table> 
        )
    }
    return (
        <div className="mini-calendar-container">
            <div className="mini-calendar-header">
                <button className="mini-calendar-btn">
                    <img className="mini-calendar-img" onClick={handlePrevMonth} src={arrowLeft}></img>
                </button>
                <span className="mini-calendar-header-month"> {monthNames[viewMonth.getMonth()] + " " + viewMonth.getFullYear()}</span>
                <button className="mini-calendar-btn">
                    <img className="mini-calendar-img" onClick={handleNextMonth} src={arrowRight}></img>
                </button>
            </div>
            <div className="mini-calendar-body">
                {loadCalendarGrid()}
            </div>
        </div>
    )
}

export { MiniCalendar }