import React, { FC } from 'react';
import MiniCalendar from './MiniCalendar'; 
import '../calendarCSS/LeftSidebar.css';

interface LeftSidebarProps {
    showModal: boolean;
    setShowModal: Function;
    viewDate: Date;
    setViewDate: Function;
    today: Date;
}
const LeftSidebar: FC<LeftSidebarProps> = ({showModal, setShowModal, viewDate, setViewDate, today }) => {
    return (
        <div className="left-sidebar">
            {/* Add event sets modal state to (true) (show), which shows the modal*/}
            <button className="add-event-btn" onClick={() => setShowModal(true)}> + Add Event </button>
            <MiniCalendar
                currentMonth={viewDate}
                today={today}
                setViewDate={setViewDate}
            />
        </div>
    )
}

export{ LeftSidebar }