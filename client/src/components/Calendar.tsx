import React, { FC, useState } from "react";
import './calendarCSS/Calendar.css';
import headerIcon from '../assets/icon.png';
import sideBar from '../assets/sidebar.svg'
import { LeftSidebar } from "./calendarComponents/LeftSidebar"
import { CalendarDisplay } from "./calendarComponents/CalendarDisplay";

/*
* Parent level component for application 
*/
const Calendar: FC = ({}) => {
    const [displayMode, setDisplayMode] = useState('d');
    const [today, setToday] = useState(new Date());
    const [viewDate, setViewDate] = useState(today);
    /* nextPrevDateBtns: Renders the next date and prev date buttons */
    const nextPrevDateBtns = () => {
        return(
            <div className="next-prev-btn-container">
                <button onClick={() => handleToday()}>Today</button>
                <button onClick={() => handlePrevDate()}>Prev</button>
                <button onClick={() => handleNextDate()}>Next</button>
            </div>
        )
    }

    /* handleNextDate: handles the next date button press */
    const handleNextDate = () => {
        if (displayMode === 'd') {
            // day display mode, set day to be the next day
            let nextDay = new Date(viewDate);
            nextDay.setDate(viewDate.getDate() + 1);
            setViewDate(nextDay);
        }
    }

    /* handlePrevDate: handles the prev date button press */
    const handlePrevDate = () => {
        let prevDay = new Date(viewDate);
        prevDay.setDate(viewDate.getDate() - 1);
        setViewDate(prevDay);
    }

    /* handleToday: handles the today button press */
    const handleToday = () => {
        setViewDate(today);
    }


    return(
        <div className="calendar">
            <div className="calendar-header">
                <img className="sidebar-icon" src={sideBar}/>
                <div className="logo-text-container">
                    <img className="header-icon" src={headerIcon}/>
                    <span className="icon-name">Calendar</span>
                </div>
                {nextPrevDateBtns()}
            </div>
            <div className="calendar-body">
                <LeftSidebar/>
                <CalendarDisplay displayMode={displayMode} today={today} viewDate = {viewDate} />
            </div>
        </div>
    )
};

export{Calendar}