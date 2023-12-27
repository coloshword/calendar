import React, { FC } from 'react';
import '../calendarCSS/LeftSidebar.css';

const LeftSidebar: FC = ({}) => {
    return (
        <div className="left-sidebar">
            <button> + Add Event</button>
        </div>
    )
}

export{ LeftSidebar }