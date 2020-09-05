import React from "react";
import 'bootswatch/dist/yeti/bootstrap.min.css';
import "./menu.css";
import { NavLink } from "react-router-dom";

const Menu = ()=>{
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary nav-container mt-1">
            <div className = "collapse navbar-collapse">
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