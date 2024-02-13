import React, { FC, useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import '../calendarCSS/UserTab.css';
import personCircle from '../../assets/person-circle.svg';
import xIcon from '../../assets/x.svg';

interface UserTabProps {
    setShowUserTab: Function,
}
/** UserTab: component for displaying the user information and also logout buttons */
const UserTab: FC<UserTabProps> = ({setShowUserTab}) => {
    const auth = useAuth();
    const navigate = useNavigate();
    /** handleLogout: handles clicking of lougout in UserTab. Calls logout in auth and also redirects to the landing page  */
    function handleLogout() {
        auth.logout();
        navigate('/');
    }

    return(
        <div className="user-tab">
            <div className="user-tab-header">
                <img className="user-tab-x-icon" src={xIcon} onClick={() => setShowUserTab(false)}></img>
            </div>
            <img className="user-tab-icon" src={personCircle}></img>
            <span className="logged-in-text"> {auth.userEmail} </span>
            <button className="btn btn-danger" onClick={() => handleLogout()}> Logout </button>
        </div>
    )
}

export {UserTab}