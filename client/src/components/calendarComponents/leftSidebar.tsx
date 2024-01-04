import React, { FC } from 'react';
import '../calendarCSS/LeftSidebar.css';

interface LeftSidebarProps {
    showModal: boolean;
    setShowModal: Function;
}
const LeftSidebar: FC<LeftSidebarProps> = ({showModal, setShowModal}) => {
    return (
        <div className="left-sidebar">
            {/* Add event sets modal state to (true) (show), which shows the modal*/}
            <button onClick={() => setShowModal(true)}> + Add Event </button>
        </div>
    )
}

export{ LeftSidebar }