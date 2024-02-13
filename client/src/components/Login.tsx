import {useState, useEffect} from "react";
import axios from "axios";
import './calendarCSS/Register.css';
import logo from '../assets/icon.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";

const Login = ({}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUserEmail } = useAuth();
    async function handleLogin() {
        let response;
        try {
            console.log("post request");
            response = await axios.post('http://localhost:3500/login', {
                email: email,
                password: password
            });
            localStorage.setItem('token', response.data.token);
            setUserEmail(response.data.email);
            navigate('/calendar');
        }
        catch(error) {
            if(axios.isAxiosError(error)) console.log(error.response!.data.msg);
        }
    }

    /** handleKeyDown: handles pressing of enter as submit  */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
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
                    <input 
                        className="register-input" 
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                    ></input>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="register-input" 
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    ></input>
                </div>
                <button
                    className="register-btn"
                    onClick={() => handleLogin()}
                    >Login</button>
                <a href="http://localhost:3000/register" className="link">Don't have an account? Register</a>
                <div className="register-footer"></div>
            </div>
        </div>
    )
};

export{Login}
