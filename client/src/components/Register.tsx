import {useState, useEffect} from "react";
import axios from "axios";
import './calendarCSS/Register.css';
import logo from '../assets/icon.png';

const Register = ({}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    /** verifyInputs: verifies the inputs of the register form. Returns the empty string if no issue, otherwise returns the error as string */
    function verifyInputs() : string {
        const emailTest = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
        if(!emailTest.test(email)) return 'Please enter a valid email';
        if(password != confirmPassword) return 'Passwords do not match';
        return '';
    }

    async function submitRegister() {
        let isValid:string = verifyInputs(); 
        if(isValid != '') {
            console.log(isValid);
            return; 
        }
        try {
            console.log("post request");
            // verify inputs
            let response = await axios.post('http://localhost:3500/register', {
                email: email,
                password: password
            });
        }catch(error) {
            console.error("Failed to register user ", error);
        }
        // console.log(`email ${email}`);
        // console.log(`password ${password}`);
        // console.log(`confirm password ${confirmPassword}`);
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
                    <input type="password" className="register-input" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
                    <input type="password" className="register-input" placeholder="Confirm" onChange={(e) => setConfirmPassword(e.target.value)}></input>
                </div>
                <button 
                    className="register-btn"
                    onClick={() => submitRegister()}
                    >Register</button>
                <div className="register-footer"></div>
            </div>
        </div>
    )
};

export{Register}