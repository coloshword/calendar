import React, { FC } from "react";
import { Header }  from "./calendarComponents/Header"
import './calendarCSS/Calendar.css';

const Calendar: FC = ({}) => {
    return(
        <div className="calendar">
            <Header/>
            <div className="calendar-body"></div>
        </div>
    )
};

export{Calendar}