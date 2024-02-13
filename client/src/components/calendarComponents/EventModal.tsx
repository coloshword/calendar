import React, {FC} from 'react';
import '../calendarCSS/EventModal.css';
import xIcon from '../../assets/x.svg'

interface Event {
    title: string;
    date: Date;
    start: [number, number];
    end: [number, number];
    descript: string;
    eventColor: string;
}

interface EventModalProps {
    currentEvent: Event | null;
    setShowModal: Function;
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

const EventModal: FC<EventModalProps> = ({currentEvent, setShowModal}) => {
    if (currentEvent === null) {
        return null;
    }
    return (
        <div className="event-details-modal">
            <div className="event-details-modal-header" style={{backgroundColor: currentEvent.eventColor}}>
                <img className="event-details-modal-close" src={xIcon} onClick={() => setShowModal(false)}></img>
            </div>
            <div className="event-details-body">
                <div className="event-details-time">
                    <span className="event-details-title"> {currentEvent.title} </span>
                    <span> {`${currentEvent.date.toDateString()} ⋅ ${formatTime(currentEvent.start)} - ${formatTime(currentEvent.end)}`} </span>
                </div>
                {currentEvent.descript != '' &&
                    <div className="event-description">
                    {currentEvent.descript}
                    </div>
                }
            </div>
        </div>
    )
}

export {EventModal};