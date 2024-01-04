import React, { FC, useState, useEffect } from 'react';
import { AddEvent } from './AddEvent';
import '../calendarCSS/Day.css';

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
    start: [number, number];
    end: [number, number];
}


/* Day: component that renders a "day" of the calendar --> specifically in day mode */
const Day: FC<DayProps> = ({ day, today, showModal, setShowModal}) => {
    /* renderDate: renders the display of day of the week and the date (of the month) */
    const [events, setEvents] = useState<Event[]>([]);
    const [domRect, setDomRect] = useState<DOMRect>();
    useEffect(() => {
        let div: HTMLElement = document.querySelector('.day-grid') as HTMLElement;
        setDomRect(div.getBoundingClientRect());
    }, [events])
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

    function getEventHeight(start: [number, number], end: [number, number], domRect: DOMRect) {
        return getPosFromTime(end[0], end[1], domRect) - getPosFromTime(start[0], start[1], domRect);
    }

    /* addEvent: adds an event to the Day Calendar by adding it to the Calendar state:
    an event is a object with a title, start, end;
    */
    function addEvent(title: string, start: [number, number] , end: [number, number]): void {
        let newEvent = {
            title: title,
            start: start,
            end: end,
        };
        setEvents([newEvent])
    }

    function printMousePos(e: React.MouseEvent<HTMLDivElement>): void {
        // let scrollTop = div.scrollTop;
        // let cursorY = e.clientY - rect.top + scrollTop;
        // getPosFromTime(13, 30, rect);
        // console.log(cursorY);
        // let div: HTMLElement = document.querySelector('.day-grid') as HTMLElement;
        // let rect:DOMRect = div.getBoundingClientRect();
        // addEvent('deez nuts', [2, 45], [6, 45]);
        // console.log(events);
        console.log(showModal);
    }

    const renderEvents = () => {
        return events.map((event, index) => {
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
        });
    }


    /* renderDayGrid: renders the visual "grid" that represents a day */
    const renderDayGrid = () => {
        return (
            <div className="day-grid-container" onClick={(e) => printMousePos(e)}>
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
                    <div className="day-grid">
                        {Array.from({ length: 25 }, (_, i) => i).map(num => (
                            <hr key={num} className="hour-line"></hr>
                        ))}
                        {renderEvents()}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="day-container unselectable">
            {showModal && (
                <AddEvent setShowModal={setShowModal}/>
            )}
            {renderDate()}
            {renderDayGrid()}
        </div>
    );
}

export { Day };