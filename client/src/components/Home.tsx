import {Link} from "react-router-dom";
import { useAuth } from "./AuthProvider";

/** Home page of the application */
const Home = ({}) => {
    const { setIsGuest } = useAuth();
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
                    <button onClick={ () => setIsGuest(true) }
                    >Continue as guest</button>
                </Link>
            </div>
        </div>
    )
};

export{Home}