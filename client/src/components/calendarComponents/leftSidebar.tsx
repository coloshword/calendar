import React, { FC } from 'react';
import '../calendarCSS/LeftSidebar.css';

const LeftSidebar: FC = ({}) => {
    return (
        <div className="left-sidebar">
            {/* Add event sets modal state to (true) (show), which shows the modal*/}
            <button> + Add Event </button>
        </div>
    )
}

export{ LeftSidebar }