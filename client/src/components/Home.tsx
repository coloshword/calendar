import {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
const Home = ({}) => {
    return(
        <div className="homePage">
            <h3>lightCalendar</h3>
            <div className="home-redirect">
                <Link to="/login">
                    <button>Login</button>
                </Link>
                <Link to="/register">
                    <button>Register</button>
                </Link>
                <Link to="/calendar">
                    <button>Continue as guest</button>
                </Link>
            </div>
        </div>
    )
};

export{Home}