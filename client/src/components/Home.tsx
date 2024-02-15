import {Link} from "react-router-dom";
import { useAuth } from "./AuthProvider";
import imageWebP from "../assets/landing2.webp";
import imagePng from "../assets/landingpage.png";
import TypewriterEffect from "./helperComponents/TypewriterEffect";
import "./calendarCSS/Home.css";

/** Home page of the application */
const Home = ({}) => {
    const { setIsGuest } = useAuth();
    return(
        <div className="home-page">
            <div className="landing-image">
                <picture>
                    <source srcSet={imageWebP} type="image/webp"/>
                    <source srcSet={imagePng} type="image/jpeg"/> 
                    <img src={imagePng} alt="lightCalendar Landing" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </picture>
            </div>
            <div className="home-redirect">
                <div className="home-links">
                <h3 className="title-name"><TypewriterEffect text={'lightCalendar'} period={2000} /></h3>
                    <div className="login-register-container">
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button className="home-buttons login-register-btn">Log in</button>
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <button className="home-buttons login-register-btn">Register</button>
                        </Link>
                    </div>
                    <Link to="/calendar" style={{ textDecoration: 'none' }}>
                        <button  className="home-buttons guest-btn" onClick={ () => setIsGuest(true) }
                        >Continue as guest</button>
                    </Link>
                </div>
            </div>
        </div>
    )
};

export{Home}