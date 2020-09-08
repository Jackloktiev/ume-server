import React from "react";
import 'bootswatch/dist/yeti/bootstrap.min.css';
import "./menu.css";
import { NavLink } from "react-router-dom";

const Menu = ()=>{
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary nav-container mt-1">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className = "collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <NavLink to="/app" className = "nav-item link">Home</NavLink>
                    <NavLink to="/user-profile" className = "nav-item link">User Profile</NavLink>
                    <NavLink to="/history" className = "nav-item link">History</NavLink>
                    <NavLink to="/" className = "nav-item link">Log Out</NavLink>
                </ul>
            </div>
        </nav>
    )
}

export default Menu;