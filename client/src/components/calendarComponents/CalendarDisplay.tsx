import React, { FC, useState } from 'react';
import '../calendarCSS/CalendarDisplay.css';
import { Day } from './Day'

interface CalendarDisplayProps {
    displayMode: string;   // prop from Calendary --> the current mode we are displaying 
    today: Date;    // prop from Calendar --> the date today is 
    viewDate: Date; // prop from Calendar --> the date we are viewing
    showModal: boolean; // prop from Calendar --> whether or not to show the add event modal
    setShowModal: Function; // prop from Calendar --> function to set the show modal state
}

const CalendarDisplay: FC<CalendarDisplayProps> = ({displayMode, viewDate, today, showModal, setShowModal}) => {
    /* State of the Calendar being displayed, whether day, week, or month. Will be passed as a prop later*/
    // on load we load the current date
    return (
        <div className="calendar-display">
            {displayMode === 'd' && <Day day={viewDate} today={today} showModal={showModal} setShowModal={setShowModal}/>} 
        </div>
    )
}

export{ CalendarDisplay }