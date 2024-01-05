/* add event modal */
import React, {FC, useState} from 'react';
import '../calendarCSS/AddEvent.css';
import closeIcon from '../../assets/x.svg';

interface Event {
    title: string;
    date: Date;
    start: [number, number];
    end: [number, number];
    descript: string;
}

interface AddEventProps {
    setShowModal: Function;
    events: Event[];
    setEvents: Function;
}
const AddEvent: FC<AddEventProps> = ({setShowModal, events, setEvents}) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(''); // default is today but can be changed 
    const [startTime, setStartTime] = useState(''); // of the for 'hh, mm' in 24 hour time
    const [endTime, setEndTime] = useState(''); // same as start time
    const [descript, setDescript] = useState('');
    /* addEvent: adds an event to the Calendar by adding it to the Event prop
    an event is a object with a title, start, end;
    Adding an event to the events prop will cause the Day component to render the new event   
    */
    function addEvent(title: string, date: Date, start: [number, number] , end: [number, number], descript: string): void {
        let newEvent = {
            title: title,
            date: date,
            start: start,
            end: end,
            descript: descript
        };
        console.log(newEvent);
        setEvents([...events, newEvent])
    }

    function convertToMilitaryTime(timeStr: string): [number, number] {
        const regex = /(\d{1,2}):(\d{2})(am|pm)/i;
        const match = timeStr.match(regex);
    
        if (match) {
            let hours = parseInt(match[1]);
            let minutes = parseInt(match[2]);
            const period = match[3];
    
            if (period.toLowerCase() === 'pm' && hours !== 12) {
                hours += 12;
            } else if (period.toLowerCase() === 'am' && hours === 12) {
                hours = 0;
            }
    
            return [hours, minutes];
        } else {
            throw new Error('Invalid time format');
        }
    }
    

    /* handleAddEvent: event listener to handle adding an event */
    function handleAddEvent() {
        console.log(title); // formatted properly
        console.log(date);
        console.log(startTime);
        console.log(endTime);
        console.log(descript);
        // format data properly to be an event
        let dateAsArray = date.split('/');
        let eventDate = new Date(Number(dateAsArray[2]), Number(dateAsArray[0]) - 1, Number(dateAsArray[1]));
        let eventStart = convertToMilitaryTime(startTime);
        let eventEnd = convertToMilitaryTime(endTime);
        addEvent(title, eventDate, eventStart, eventEnd, descript);
    }
    return(
        <div className="add-event-modal">
            <div className="add-event-header">
                <button className="add-event-close-btn" onClick={() => setShowModal(false)}>
                    <img className="modal-close-img" src={closeIcon}></img>
                </button>
            </div>
            <div className="add-event-body">
                <div className="add-event-left"></div>
                <div className="add-event-right">
                    <input type="text" placeholder='Add title' className="add-title-input" onChange={e => setTitle(e.target.value)}></input>
                    <div className="event-type-container">
                        <button className="event-type-btn">Event</button>
                        <button className="event-type-btn">Task</button>
                    </div>
                    <div className="add-event-time-container">
                        <input type="text" placeholder="mm/dd/yyyy" className="event-time-input date-input" onChange={e => setDate(e.target.value)}></input>
                        <input type="text" placeholder="hh:mm" className="event-time-input start-input" onChange={e => setStartTime(e.target.value)}></input>
                        <span>-</span>
                        <input type="text" placeholder="hh:mm" className="event-time-input end-input" onChange={e => setEndTime(e.target.value)}></input>
                    </div>
                    <div className="add-event-description-container">
                        <textarea placeholder="Add description" className="add-event-description" onChange={e => setDescript(e.target.value)}></textarea>
                    </div>
                    <div className="submit-event-container">
                        <button className="submit-event-btn" onClick={handleAddEvent}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {AddEvent};