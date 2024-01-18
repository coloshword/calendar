import '../calendarCSS/MiniCalendar.css';
import { useState, useEffect, FC, memo } from 'react';
import arrowLeft from '../../assets/arrow-left.svg';
import arrowRight from '../../assets/arrow-right.svg';

interface MiniCalendarProps {
    currentMonth: Date;
}
const MiniCalendar: FC<MiniCalendarProps> = ({currentMonth}) => {

    const [viewMonth, setViewMonth] = useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth()));

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        // Update viewMonth whenever currentMonth changes
        setViewMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth()));
    }, [currentMonth]);

    /* getFirst: returns the first of the month*/ 
    function getFirst(date: Date) : Date{
        let year = date.getFullYear();
        let month = date.getMonth();
        let first: Date = new Date(year, month, 1);
        return first
    }

    /* getLast: returns the last of the month */
    function getLast(date: Date) : Date {
        let year = date.getFullYear();
        let month = date.getMonth();
        let last: Date = new Date(year, month + 1 , 0);
        return last;
    }

    /* getNext: returns the next of the month */
    function getNext(date: Date) : Date {
        return new Date(date.getFullYear(), date.getMonth() + 1);
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

    /* numDays = gets the  number of days in year from the year and month*/
    const numDays = (m: number, y: number) => new Date(y, m + 1, 0).getDate(); 

    function loadCalendarGrid() {
        console.log("load called");
        /* create dictionary mapping index to [month, day, year] 
        ie --> index 0 == the first sunday displayed 
        add event listener to each with the dictionary day mapping 
        */
        let indexToDate: {[key: number] : number[]} = {};
        // map the first day of the week to the right index, fill in the rest backwards
        let first = getFirst(currentMonth);
        indexToDate[first.getDay()] = [first.getMonth(), first.getDate(), first.getFullYear()];
        let lastOfLastMonth = getLast(new Date(first.getFullYear(),first.getMonth() - 1));
        // populate the last month dates 
        for(let i = 0; i < first.getDay(); i++) {
            indexToDate[i] = [lastOfLastMonth.getMonth(), lastOfLastMonth.getDate() - (first.getDay() - i) + 1, lastOfLastMonth.getFullYear()]
        }
        //populate this month dates 
        let daysInCurMonth = numDays(first.getMonth(), first.getFullYear());
        let offset = first.getDay();
        for(let i = 1; i < daysInCurMonth; i++) {
            indexToDate[offset + i] = [first.getMonth(), first.getDate() + i, first.getFullYear()];
        }
        // populate the rest of the month dates 
        let calendarLength: number = Object.keys(indexToDate).length;
        let nextMonth = getNext(first);
        for(let i = 0; i < 42 - calendarLength; i++) {
            indexToDate[i + calendarLength] = [nextMonth.getMonth(), nextMonth.getDate() + i, nextMonth.getFullYear()];
        }
        // create the grid 
        const renderCells = (row: number) => {
            const elementsInRow = [];
            for(let i = 0; i < 7; i++) {
                elementsInRow.push(
                    <td className="week-cell" key={i}>
                        {/* get the date of the correct cell*/}
                        {indexToDate[row * 7 + i][1]} 
                    </td>
                )
            }
            return elementsInRow;
        }
        const renderRows = () => {
            const rows = [];
            for(let i = 0; i < 6; i++) {
                rows.push(
                <tr key={i}>
                    {renderCells(i)}
                </tr>)
            }
            return rows;
        }

        return (
            <table className="mini-calendar-grid">
                <tbody>
                    <tr>
                        <td className="week-cell"> S </td>
                        <td className="week-cell"> M </td>
                        <td className="week-cell"> T </td>
                        <td className="week-cell"> W </td>
                        <td className="week-cell"> T </td>
                        <td className="week-cell"> F </td>
                        <td className="week-cell"> S </td>
                    </tr>
                    {renderRows()}
                </tbody>
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

export default memo(MiniCalendar);