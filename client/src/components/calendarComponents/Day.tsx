import React, { FC, useState, useEffect, useRef } from 'react';
import { AddEvent } from './AddEvent';
import '../calendarCSS/Day.css';
import {EventModal} from './EventModal';


const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
// Define the props type
interface DayProps {
    day: Date;
    today: Date;
    showModal: boolean;
    setShowModal: Function;
}

interface Event {
    title: string;
    date: Date;
    start: [number, number];
    end: [number, number];
    descript: string;
    eventColor: string;
}

interface DragEventDetails {
    top: number;
    height: number;
}


/* Day: component that renders a "day" of the calendar --> specifically in day mode */
const Day: FC<DayProps> = ({ day, today, showModal, setShowModal}) => {
    /* renderDate: renders the display of day of the week and the date (of the month) */
    const [events, setEvents] = useState<Event[]>([]);
    const [domRect, setDomRect] = useState<DOMRect>();
    const [isDragging, setIsDragging] = useState(false); // used to check if user is dragging to create event 
    const [dragEvent, setDragEvent] = useState<DragEventDetails | null>(null); //used to render the drag event
    const dayGridRef = useRef<HTMLDivElement>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    /* States to control modal */
    const [defaultModalDate, setDefaultModalDate] = useState(day); //default date is today
    const [defaultModalStart, setDefaultModalStart]= useState([0, 0]);
    const [defaultModalEnd, setDefaultModalEnd] = useState([1, 0]); //default times are 12:00am to 1:00am

    useEffect(() => {
        if(dayGridRef.current) {
            setDomRect(dayGridRef.current.getBoundingClientRect());
        }
        if (!showModal) {
            // If showModal is false, reset dragEvent to null.
            setDragEvent(null);
        }
    }, [events, dayGridRef, showModal]);

    const renderDate = () => {
        return (
            <div className="day-date-container">
                <span>{dayNames[day.getDay()]}</span>
                <div className={(day.toDateString() == today.toDateString() ? "day-date-today" : "") + " day-date-circle"}>
                    {day.getDate()}
                </div>
            </div>
        )
    }

    /* Given a time, (hr, minute), returns the position relative */
    function getPosFromTime(hr: number, minute:number,  domRect: DOMRect): number{
        // find the distance between hours and also the initial offset
        let firstHrRect = document.querySelectorAll('.hour-line')[0].getBoundingClientRect(); 
        let offset = firstHrRect.top - domRect.top;
        // distance is second element offset minsu first 
        let distanceBtHrs = (document.querySelectorAll('.hour-line')[1].getBoundingClientRect().top - domRect.top) - offset;
        let ans = (hr * distanceBtHrs) + (minute / 60) * distanceBtHrs + offset;
        return ans;
    }

    /* getTimeFromPos: given a position, returns the time (hr, minute) */
    function getTimeFromPos(pos: number, domRect: DOMRect): [number, number] {
        let firstHrRect = document.querySelectorAll('.hour-line')[0].getBoundingClientRect(); 
        let offset = firstHrRect.top - domRect.top;
        let distanceBtHrs = (document.querySelectorAll('.hour-line')[1].getBoundingClientRect().top - domRect.top) - offset;
        let hr = Math.floor((pos - offset) / distanceBtHrs);
        let minute = Math.floor(((pos - offset) % distanceBtHrs) / distanceBtHrs * 60);
    
        // Round the minute to the nearest 15-minute mark
        minute = Math.round(minute / 15) * 15;
        if (minute >= 60) {
            hr++;
            minute = 0;
        }
    
        return [hr, minute];
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
    

    /* getEventHeight: gets the height of an event, given the start and end time */
    function getEventHeight(start: [number, number], end: [number, number], domRect: DOMRect) {
        return getPosFromTime(end[0], end[1], domRect) - getPosFromTime(start[0], start[1], domRect);
    }

    /* getDayGridPos: gets the y position of an event, relative to dayGrid. Meaning the top of daygrid is 0. */
    function getDayGridPos(clientPos: number, rect: DOMRect, window: HTMLElement): number {
        let scrollTop = window.scrollTop;
        let cursorY = clientPos - rect.top + scrollTop;
        return cursorY + scrollTop;
    }

    function startDrag(e: React.MouseEvent<HTMLDivElement>) {
        // close modals if they are open and don't trigger
        if(showModal || showEventModal) { 
            setShowModal(false);
            setShowEventModal(false);
            return;
        }
        // Get the initial position from the mouse event
        const initialPos = getDayGridPos(e.clientY, dayGridRef.current!.getBoundingClientRect(), dayGridRef.current!);
        
        // Snap the start position to the nearest 15-minute interval
        const [snappedHr, snappedMin] = getTimeFromPos(initialPos, domRect!);
        const snappedInitialPos = getPosFromTime(snappedHr, snappedMin, domRect!);
    
        // Set the drag event with the snapped position
        setDragEvent({ top: snappedInitialPos, height: 0 });
        setIsDragging(true);
    }
    
    
    function dragging(e: React.MouseEvent<HTMLDivElement>) {
        if (isDragging && dragEvent) {
            const currentPos = getDayGridPos(e.clientY, dayGridRef.current!.getBoundingClientRect(), dayGridRef.current!);
            const [hr, minute] = getTimeFromPos(currentPos, domRect!);
            let snappedPos = getPosFromTime(hr, minute, domRect!); // pass domRect as the third argument
            setDragEvent({ ...dragEvent, height: snappedPos - dragEvent.top });
        }
    }
    
    
    function endDrag(e: React.MouseEvent<HTMLDivElement>) {
        // Snap start and end times to the nearest 15 minutes
        if(dragEvent) {
            const start = getTimeFromPos(dragEvent!.top, domRect!);

            const end = getTimeFromPos(dragEvent!.top + dragEvent!.height, domRect!);

        
            setIsDragging(false);
            setDefaultModalStart(start);
            setDefaultModalEnd(end);
            setDefaultModalDate(day);
            setShowModal(true);
            setIsDragging(false);
        }
    }
    

    const renderDragEvent = dragEvent && (
        <div 
            className="day-event dragging-day-event" 
            style={{ top: `${dragEvent.top}px`, height: `${dragEvent.height}px` }}>
            <span className="event-title">{"Untitled"}</span>
            <span className="event-time">{`${formatTime(getTimeFromPos(dragEvent.top, domRect!))} - ${formatTime(getTimeFromPos(dragEvent.top + dragEvent.height, domRect!))}`}</span>
        </div>
    );
    

    const renderEvents = () => {
        return events.map((event, index) => {
            if(event.date.toDateString() == day.toDateString()) {
                const top = getPosFromTime(event.start[0], event.start[1], domRect!);
                const height = getEventHeight(event.start, event.end, domRect!);
                const handleEventClick = (e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation(); 
                    setCurrentEvent(event);
                    setShowEventModal(true);    
                };
    
                return (
                    <div 
                        key={index} 
                        className="day-event" 
                        onMouseDown={handleEventClick}
                        style={{ top: `${top}px`, height: `${height}px`, backgroundColor: `${event.eventColor}`}}>
                        <span className="event-title">{event.title}</span>
                        <span className="event-time">{`${formatTime(event.start)} - ${formatTime(event.end)}`}</span>
                    </div>
                );
            }
        });
    }


    /* renderDayGrid: renders the visual "grid" that represents a day */
    const renderDayGrid = () => {
        return (
            <div className="day-grid-container">
                {/* Create 24 inner divs, representing "hours"*/}
                <div className="grid-time-container">
                <div className="hour-grid">
                    {Array.from({ length: 24 }, (_, i) => (
                        <div key={i} className="hour-section">
                            <span className="time-text">
                                {i === 0 ? '12 AM' : 
                                i < 12 ? `${i} AM` : 
                                i === 12 ? '12 PM' : 
                                `${i - 12} PM`}
                            </span>
                            <hr className="hour-line small-hour-line"></hr>
                        </div>
                    ))}
                </div>
                <div 
                    className={`day-grid ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`} 
                    ref={dayGridRef} 
                    onMouseDown={startDrag} 
                    onMouseMove={dragging} 
                    onMouseUp={endDrag}>

                        {Array.from({ length: 25 }, (_, i) => i).map(num => (
                            <hr key={num} className="hour-line"></hr>
                        ))}
                        {renderEvents()}
                        {renderDragEvent}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="day-container unselectable">
            {showModal && (
                <AddEvent setShowModal={setShowModal} events={events} setEvents={setEvents} defaultModalDate={defaultModalDate} defaultModalStart={defaultModalStart} defaultModalEnd={defaultModalEnd}/>
            )}
            {showEventModal && ( 
                <EventModal currentEvent={currentEvent} setShowModal={setShowEventModal}/>
            )}
            {renderDate()}
            {renderDayGrid()}
        </div>
    );
}

export { Day };