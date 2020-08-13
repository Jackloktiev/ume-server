import React from 'react';
import "./warning.css";
import {Link} from "react-router-dom";

function Warning (){
    return(
        <div className = "Warning" >
            <h1>Opps! It looks like your user profile is not set yet.</h1>
            <h3>We need some input from you to calculate your daily norms of nutrients</h3>
            <h3>Please go ahead and complete your user profile to see the charts</h3>
            <Link to = "/user-profile"><button className = "Warning_btn" >User Profile</button></Link>
        </div>
)}

export default Warning;