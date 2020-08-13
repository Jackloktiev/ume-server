import React from 'react';
import "./footer.css";

function Footer (){
    let year = new Date().getFullYear();
    return(
        <div className = "Footer" >
            <p className = "footerText">Jack Loktiev &copy; {year}</p>
        </div>
)}

export default Footer;