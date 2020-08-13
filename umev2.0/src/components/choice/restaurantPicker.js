import React from 'react';
import RestIcon from "./restaurantIcon";
import "./restaurantPicker.css";

function RestPicker(props) {


    return (
        <div className="RestPicker" >
            {props.data.map(restaurant => 
                <RestIcon
                    name={restaurant.name}
                    key = {restaurant.name}
                    imgUrl={restaurant.logoUrl}
                    clickHandler = {props.clickHandler}
                />
            )}


        </div>
    )
}

export default RestPicker;