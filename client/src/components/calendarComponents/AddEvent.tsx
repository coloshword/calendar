/* add event modal */
import React, {Dispatch, FC, useState} from 'react';
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
    defaultModalDate: Date;
    defaultModalStart: number[];
    defaultModalEnd: number[];
}
const AddEvent: FC<AddEventProps> = ({setShowModal, events, setEvents, defaultModalDate, defaultModalStart, defaultModalEnd}) => {
    const [title, setTitle] = useState('');
    const formattedStartTime = formatTime(defaultModalStart);
    const formattedEndTime = formatTime(defaultModalEnd);
    const [date, setDate] = useState(defaultModalDate);
    const [startTime, setStartTime] = useState(formattedStartTime);
    const [endTime, setEndTime] = useState(formattedEndTime);
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
        setEvents([...events, newEvent]);
        setShowModal(false);
    }

    function convertToMilitaryTime(timeStr: string): [number, number] {
        console.log(timeStr);
        const regex = /(\d{1,2}):(\d{2})\s*(am|pm)/i;
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
            console.log('MATCH ERROR');
            throw new Error('Invalid time format');
        }
    }

    /* time helper functions */

    /* formatDateToArray: formats date to an array of strings */
    function formatDateToArray(date: Date): string[] {
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString(); // Months are zero indexed
        let year = date.getFullYear();
    
        // Add leading zeros to day and month if they are less than 10
        if (day.length < 2) {
            day = '0' + day;
        }
        if (month.length < 2) {
            month = '0' + month;
        }
    
        return [month, day, year.toString()];
    }
    
    /* formatTime: formats time from military time to standard time */
    function formatTime(time: number[]): string {
        let period = 'am';
        if(time[0] >= 12) {
            period = 'pm';
        }
        let hours = time[0] % 12;
        if(hours === 0) {
            hours = 12;
        }
        let minutes:string = time[1].toString();
        if(Number(minutes) < 10) {
            minutes = '0' + minutes;
        }
        return `${hours}:${minutes}${period}`;
    }


    /* handleAddEvent: event listener to handle adding an event */
    function handleAddEvent() {
        // format data properly to be an event
        let dateAsArray = formatDateToArray(date);
        let eventDate = new Date(Number(dateAsArray[2]), Number(dateAsArray[0]) - 1, Number(dateAsArray[1]));
        let eventStart = convertToMilitaryTime(startTime);
        let eventEnd = convertToMilitaryTime(endTime);
        let eventTitle = title;
        if(title === '') {
            eventTitle = 'Untitled Event';
        }
        addEvent(eventTitle, eventDate, eventStart, eventEnd, descript);
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
                    <input type="text" autoFocus placeholder='Add title' className="add-title-input" onChange={e => setTitle(e.target.value)}></input>
                    <div className="event-type-container">
                        <button className="event-type-btn">Event</button>
                        <button className="event-type-btn">Task</button>
                    </div>
                    <div className="add-event-time-container">
                    <input type="text" readOnly value={date.toDateString()} className="event-time-input date-input"></input>
                    <input type="text" value={startTime} className="event-time-input start-input" onChange={e => setStartTime(e.target.value)}></input>
                    <span>-</span>
                    <input type="text" value={endTime} className="event-time-input end-input" onChange={e => setEndTime(e.target.value)}></input>
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