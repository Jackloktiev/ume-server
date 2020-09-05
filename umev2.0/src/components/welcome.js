import React from 'react';
import { Link } from "react-router-dom";
import 'bootswatch/dist/yeti/bootstrap.min.css'; // Added this :boom:
import "./welcome.css";

function Welcome() {
    return (
        <div className="card text-white bg-primary welcome mt-3">
            <div className="card-body" >
                <h1 className="welcome-label">Welcome!</h1>
                <div>
                    <p>Ume will help you to track your daily consumption of calories, carbs, proteins and fats. We have a list of your favourite meals from wide range of restaurants for you to choose from.</p>
                </div>
                <div className="btn-group">
                    <Link to="/login" className="btn btn-primary" >Login</Link>
                    <Link to="/register" className="btn btn-primary" >Register</Link>
                </div>
            </div>
        </div>
    )
}

export default Welcome;