import React, { FC, useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar'; 
import axios from 'axios';
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
    const [notes, setNotes] = useState<{ [date: string]: string }>({});  // NOTE: the key, date is of string type but is actually a Date object's toDateString() output 
    
    // effect to fetch notes from the database only on component mount
    useEffect(() => {
        getNotes();
    }, []);

    // effect to update displayed note when `notes` or `viewDate` changes
    useEffect(() => {
        const currentNote = notes[viewDate.toDateString()] || '';
        setNote(currentNote);
    }, [notes, viewDate]);

    /** getNotes: get the notes from the db */
    async function getNotes() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3500/get-note', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // upon successful message, set the notes object to the response 
            setNotes(response.data.message);
        } catch(error) {
            console.log(error);
        }
    }
    /** handleNoteChange: handles note change by changing the note value */
    function handleNoteChange(str: string) {
        setNote(str);
    }

    /** saveNote: Event handler to save the note by sending it to the db also updating the notes dict  */
    function saveNote() {
        notes[viewDate.toDateString()] = note;
        // try to update note object in the db
        updateDateNote(notes);
    }

    /** updateDateNote: attempts to update the notes object for the user in the db  */
    async function updateDateNote(note: Object) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3500/update-note', note, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("note updated successfully:", response.data);
        }catch (error) {
            console.log("Failed to add note ", error);
        }
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
                <textarea placeholder="Add a note for this day" className="add-event-description" value = {note} onChange={(e) => handleNoteChange(e.target.value)}></textarea>
                <button onClick={() => saveNote()}> Save Note</button>
            </div>
        </div>
    )
}

export{ LeftSidebar }