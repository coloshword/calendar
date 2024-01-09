import React, { FC, useState, useEffect, useRef } from 'react';
import { AddEvent } from './AddEvent';
import '../calendarCSS/Day.css';
import { render } from '@testing-library/react';

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
    const [dragEvent, setDragEvent] = useState<DragEventDetails | null>(null);
    const dayGridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(dayGridRef.current) {
            setDomRect(dayGridRef.current.getBoundingClientRect());
        }
    }, [events, dayGridRef]);

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

    /* getEventHeight: gets the height of an event, given the start and end time */
    function getEventHeight(start: [number, number], end: [number, number], domRect: DOMRect) {
        return getPosFromTime(end[0], end[1], domRect) - getPosFromTime(start[0], start[1], domRect);
    }

    /* getDayGridPos: gets the y position of an event, relative to dayGrid. Meaning the top of daygrid is 0. */
    function getDayGridPos(clientPos: number, rect: DOMRect, window: HTMLElement): number {
        let scrollTop = window.scrollTop;
        let cursorY = clientPos - rect.top + scrollTop;
        // let div: HTMLElement = document.querySelector('.day-grid') as HTMLElement;
        // let rect:DOMRect = div.getBoundingClientRect();
        return cursorY + scrollTop;
    }

    function startDrag(e: React.MouseEvent<HTMLDivElement>) {
        const initialPos = getDayGridPos(e.clientY, dayGridRef.current!.getBoundingClientRect(), dayGridRef.current!);
        setDragEvent({ top: initialPos, height: 0 });
    }

    function dragging(e: React.MouseEvent<HTMLDivElement>) {
        if (dragEvent) {
            const currentPos = getDayGridPos(e.clientY, dayGridRef.current!.getBoundingClientRect(), dayGridRef.current!);
            setDragEvent({ ...dragEvent, height: currentPos - dragEvent.top });
        }
    }

    function endDrag(e: React.MouseEvent<HTMLDivElement>) {
        setDragEvent(null); 
    }

    function test(e: React.DragEvent<HTMLDivElement>) {
        if (dayGridRef.current) {
            console.log(getDayGridPos(e.clientY, dayGridRef.current.getBoundingClientRect(), dayGridRef.current));
        }
    }

    const renderDragEvent = dragEvent && (
        <div 
            className="day-event" 
            style={{ top: `${dragEvent.top}px`, height: `${dragEvent.height}px` }}>
            {"Untitled"}
        </div>
    );
    

    const renderEvents = () => {
        return events.map((event, index) => {
            if(event.date.toDateString() == day.toDateString()) {
                const top = getPosFromTime(event.start[0], event.start[1], domRect!);
                const height = getEventHeight(event.start, event.end, domRect!);
                return (
                    <div 
                        key={index} 
                        className="day-event" 
                        style={{ top: `${top}px`, height: `${height}px` }}>
                        {event.title}
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
                <div className="day-grid" ref={dayGridRef} onMouseDown={startDrag} onMouseMove={dragging} onMouseUp={endDrag}>
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
                <AddEvent setShowModal={setShowModal} events={events} setEvents={setEvents}/>
            )}
            {renderDate()}
            {renderDayGrid()}
        </div>
    );
}

export { Day };