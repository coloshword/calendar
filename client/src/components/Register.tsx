import {useState, useEffect} from "react";
import axios from "axios";
import './calendarCSS/Register.css';
import logo from '../assets/icon.png';

const Register = ({}) => {

    return(
        <div className="register-page">
            <div className="register-modal card">
                <div className="register-header">
                    <img className="register-logo" src={logo}></img>
                    <span className="logo-text">lightCalendar</span>
                </div>
                <span className="register-text">Register</span>
                <div className="register-input-fields">
                    <input className="register-input" placeholder="Email"></input>
                    <input type="password" className="register-input" placeholder="Password"></input>
                    <input type="password" className="register-input" placeholder="Confirm"></input>
                </div>
                <button className="register-btn">Register</button>
                <div className="register-footer"></div>
            </div>
        </div>
    )
};

export{Register}