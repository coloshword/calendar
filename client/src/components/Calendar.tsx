import React, { FC } from "react";
import './calendarCSS/Calendar.css';
import headerIcon from '../assets/icon.png';
import sideBar from '../assets/sidebar.svg'

const Calendar: FC = ({}) => {
    return(
        <div className="calendar">
            <div className="calendar-header">
                <img className="sidebar-icon" src={sideBar}/>
                <div className="logo-text-container">
                    <img className="header-icon" src={headerIcon}/>
                    <span className="icon-name">Calendar</span>
                </div>
            </div>
            <div className="calendar-body"></div>
        </div>
    )
};

export{Calendar}