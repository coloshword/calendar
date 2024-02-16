import {useState, useEffect} from "react";
import axios from "axios";
import './calendarCSS/Register.css';
import logo from '../assets/icon.png';
import { useNavigate } from 'react-router-dom'
import { useAuth } from "./AuthProvider";

const Register = ({}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {setIsGuest, setIsLoggedIn, setUserEmail} = useAuth();
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    /** verifyInputs: verifies the inputs of the register form. Returns the empty string if no issue, otherwise returns the error as string */
    function verifyInputs() : string {
        const emailTest = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
        if(!emailTest.test(email)) {
            setErrorMsg('Please enter a valid email');
            return 'Please enter a valid email';
        }
        if(password.length == 0) {
            setErrorMsg('Password cannot be empty');
            return 'Password cannot be empty';
        }
        if(password != confirmPassword ) {
            setErrorMsg('Passwords do not match');
            return 'Passwords do not match';
        }
        return '';
    }

        /** handleKeyDown: handles pressing of enter as submit  */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            submitRegister();
        }
    }

    async function submitRegister() {
        let isValid:string = verifyInputs(); 
        if(isValid != '') {
            console.log(isValid);
            return; 
        }
        try {
            // verify inputs
            let response = await axios.post('/register', {
                email: email,
                password: password
            });
            console.log(response.data.token);
            //save token and redirect just as if logged in
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.email);
            setIsLoggedIn(true);
            setIsGuest(false);
            setUserEmail(response.data.email);
            navigate('/calendar');
        }catch(error) {
            if(axios.isAxiosError(error)) {
                setErrorMsg(error.response!.data.msg);
            }
        }
    }
    return(
        <div className="register-page">
            <div className="register-modal card">
                <div className="register-header">
                    <img className="register-logo" src={logo}></img>
                    <span className="logo-text">lightCalendar</span>
                </div>
                <span className="register-text">Register</span>
                <div className="register-input-fields">
                    <input className="register-input" placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" className="register-input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}></input>
                    <input type="password" className="register-input" placeholder="Confirm" onChange={(e) => setConfirmPassword(e.target.value) } onKeyDown={handleKeyDown}></input>
                    {errorMsg != '' && <span className="error-message-disp">{errorMsg}</span>}
                </div>
                <button 
                    className="register-btn"
                    onClick={() => submitRegister()}
                    >Register</button>
                <a href="/login"> Sign in</a>
                <div className="register-footer"></div>
            </div>
        </div>
    )
};

export{Register}