import React from "react";
import "./menu.css";
import { NavLink } from "react-router-dom";

const Menu = ()=>{
    return(
        <div className = "menu">
            <NavLink to="/app" className = "link">Home</NavLink>
            <NavLink to="/user-profile" className = "link">User Profile</NavLink>
            <NavLink to="/history" className = "link">History</NavLink>
            <NavLink to="/" className = "link">Log Out</NavLink>
        </div>
    )
}

export default Menu;