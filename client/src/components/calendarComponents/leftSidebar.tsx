import React, { FC, useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar'; 
import '../calendarCSS/LeftSidebar.css';

interface LeftSidebarProps {
    showModal: boolean;
    setShowModal: Function;
    viewDate: Date;
    setViewDate: Function;
    today: Date;
}

/** The left side bar also has notes, it handles everything within the left sidebar */
const LeftSidebar: FC<LeftSidebarProps> = ({showModal, setShowModal, viewDate, setViewDate, today }) => {
    const [note, setNote] = useState('');
    var notes: { [date: string ]: string } = {}; // NOTE: the key, date is of string type but is actually a Date object's toDateString() output 
    
    function handleNoteChange(str: string) {
        // we are going to set notes variable
        // store the note in the dictionary, or change it 
        notes[viewDate.toDateString()] = str;
        console.log(notes);
    }

    /** getNote: given a date, returns the note as a string. Returns the empty string if there is no note */
    function getNote(date: Date): string {
        return notes[date.toDateString()];
    }
    return (
        <div className="left-sidebar">
            {/* Add event sets modal state to (true) (show), which shows the modal*/}
            <button className="add-event-btn" onClick={() => setShowModal(true)}> + Add Event </button>
            <MiniCalendar
                currentMonth={viewDate}
                today={today}
                viewDate={viewDate}
                setViewDate={setViewDate}
            />
            <div className="add-event-description-container">
                <textarea placeholder="Add a note" className="add-event-description" value={getNote(viewDate)} onChange={(e) => handleNoteChange(e.target.value)}></textarea>
            </div>
        </div>
    )
}

export{ LeftSidebar }