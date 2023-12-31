import {useState, useEffect} from "react";
import '../calendarCSS/Header.css';
import React, { FC } from 'react';
import headerIcon from '../../assets/icon.png';
import sideBar from '../../assets/sidebar.svg'

const Header: FC = ({}) => {
    return(
        <div className="calendar-header">
            <img className="sidebar-icon" src={sideBar}/>
            <div className="logo-text-container">
                <img className="header-icon" src={headerIcon}/>
                <span className="icon-name">Calendar</span>
            </div>
        </div>
    )
}

export{ Header };