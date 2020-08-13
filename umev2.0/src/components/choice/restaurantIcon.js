import React from 'react';
import "./restaurantIcon.css";

function RestIcon(props) {
    return (
        <div>
            <img
                src= {props.imgUrl}
                alt={props.name}
                name = {props.name}
                className = "LogoImg"
                onClick = {props.clickHandler}
            />
        </div>
    )
}

export default RestIcon;