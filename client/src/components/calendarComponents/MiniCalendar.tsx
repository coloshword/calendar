import '../calendarCSS/MiniCalendar.css';
import { useState, useEffect, FC, memo } from 'react';
import arrowLeft from '../../assets/arrow-left.svg';
import arrowRight from '../../assets/arrow-right.svg';

interface MiniCalendarProps {
    currentMonth: Date;
    today: Date,
    viewDate: Date;
    setViewDate: Function;
}
const MiniCalendar: FC<MiniCalendarProps> = ({currentMonth, today, viewDate, setViewDate}) => {

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

    /** handleCalendarCellClick: handles the click of a cell */
    function handleCalendarCellClick(clickDate: number[]) {
        setViewDate(new Date(clickDate[2], clickDate[0], clickDate[1]));
    }

    /* numDays = gets the  number of days in year from the year and month*/
    const numDays = (m: number, y: number) => new Date(y, m + 1, 0).getDate(); 

    function loadCalendarGrid() {
        /* create dictionary mapping index to [month, day, year] 
        ie --> index 0 == the first sunday displayed 
        add event listener to each with the dictionary day mapping 
        */
       // [month, date, year, isMonth: 1 or 0]  // if it is 1, it is part of the month, else it is not 
        let indexToDate: {[key: number] : number[]} = {};
        // map the first day of the week to the right index, fill in the rest backwards
        let first = getFirst(viewMonth);
        indexToDate[first.getDay()] = [first.getMonth(), first.getDate(), first.getFullYear(), 1];
        let lastOfLastMonth = getLast(new Date(first.getFullYear(),first.getMonth() - 1));
        let cellClass: string[] = []; // array of the correct classes for each cell, based on the index 
        // populate the last month dates 
        for(let i = 0; i < first.getDay(); i++) {
            indexToDate[i] = [lastOfLastMonth.getMonth(), lastOfLastMonth.getDate() - (first.getDay() - i) + 1, lastOfLastMonth.getFullYear()];
            cellClass.push('otherMonth-cell');
        }
        //populate this month dates 
        let daysInCurMonth = numDays(first.getMonth(), first.getFullYear());
        let offset = first.getDay();
        for(let i = 0; i < daysInCurMonth; i++) {
            indexToDate[offset + i] = [first.getMonth(), first.getDate() + i, first.getFullYear()];
            cellClass.push('week-cell');
        }
        // populate the rest of the month dates 
        let calendarLength: number = Object.keys(indexToDate).length;
        let nextMonth = getNext(first);
        for(let i = 0; i < 42 - calendarLength; i++) {
            indexToDate[i + calendarLength] = [nextMonth.getMonth(), nextMonth.getDate() + i, nextMonth.getFullYear()];
            cellClass.push('otherMonth-cell');
        }
        
        if(viewDate.getFullYear() == first.getFullYear() && viewDate.getMonth() == first.getMonth()) {
            cellClass[offset + viewDate.getDate() - 1] = 'mini-calendar-view-date'
        }

        if(today.getFullYear() == first.getFullYear() && today.getMonth() == first.getMonth()) {
            // we know we are in today's month 
            // get the index by adding offset plus todays date 
            cellClass[offset + today.getDate() - 1] = 'mini-calendar-today';
        }
        // create the grid 
        const renderCells = (row: number) => {
            const elementsInRow = [];
            for(let i = 0; i < 7; i++) {
                elementsInRow.push(
                    <td onClick={() => handleCalendarCellClick(indexToDate[row* 7 + i])}className={cellClass[row * 7 + i]} key={i}>
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
                        <td className="otherMonth-cell "> S </td>
                        <td className="otherMonth-cell "> M </td>
                        <td className="otherMonth-cell "> T </td>
                        <td className="otherMonth-cell "> W </td>
                        <td className="otherMonth-cell "> T </td>
                        <td className="otherMonth-cell "> F </td>
                        <td className="otherMonth-cell "> S </td>
                    </tr>
                    {renderRows()}
                </tbody>
        </table> 
        )
    }
    return (
        <div className="mini-calendar-container">
            <div className="mini-calendar-header">
                <button className="mini-calendar-btn" onClick={handlePrevMonth} >
                    <img className="mini-calendar-img"src={arrowLeft}></img>
                </button>
                <span className="mini-calendar-header-month"> {monthNames[viewMonth.getMonth()] + " " + viewMonth.getFullYear()}</span>
                <button className="mini-calendar-btn" onClick={handleNextMonth}>
                    <img className="mini-calendar-img" src={arrowRight}></img>
                </button>
            </div>
            <div className="mini-calendar-body">
                {loadCalendarGrid()}
            </div>
        </div>
    )
}

export default memo(MiniCalendar);