import {useState, useEffect} from "react";
import axios from "axios";
import './calendarCSS/Register.css';
import logo from '../assets/icon.png';

const Login = ({}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin() {
        try {
            console.log("post request");
            let response = await axios.post('http://localhost:3500/login', {
                email: email,
                password: password
            });
            console.log(response);
        }catch(error) {
            console.log(error);
        }
    }

    return(
        <div className="register-page">
            <div className="register-modal card">
                <div className="register-header">
                    <img className="register-logo" src={logo}></img>
                    <span className="logo-text">lightCalendar</span>
                </div>
                <span className="register-text">Login</span>
                <div className="register-input-fields">
                    <input className="register-input" placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" placeholder="Password" className="register-input" onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <button
                    className="register-btn"
                    onClick={() => handleLogin()}
                    >Login</button>
                <div className="register-footer"></div>
            </div>
        </div>
    )
};

export{Login}