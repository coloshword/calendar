/* add event modal */
import React, {FC} from 'react';
import '../calendarCSS/AddEvent.css';
import closeIcon from '../../assets/x.svg';

interface AddEventProps {
    setShowModal: Function;
}
const AddEvent: FC<AddEventProps> = ({setShowModal}) => {
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
                    <input type="text" placeholder='Add title' className="add-title-input"></input>
                    <div className="event-type-container">
                        <button className="event-type-btn">Event</button>
                        <button className="event-type-btn">Task</button>
                    </div>
                    <div className="add-event-time-container">
                        <input type="text" placeholder="mm/dd/yyyy" className="event-time-input date-input"></input>
                        <input type="text" placeholder="hh:mm" className="event-time-input start-input"></input>
                        <span>-</span>
                        <input type="text" placeholder="hh:mm" className="event-time-input end-input"></input>
                    </div>
                    <div className="add-event-description-container">
                        <textarea placeholder="Add description" className="add-event-description"></textarea>
                    </div>
                    <div className="submit-event-container">
                        <button className="submit-event-btn">Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {AddEvent};