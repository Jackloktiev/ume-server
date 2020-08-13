import React from 'react';
import { Link } from "react-router-dom";
import "./welcome.css";

function Welcome() {
    return (
        <div className="Welcome" >
            <h1>Welcome!</h1>
            <div className = "Welcome-text" >
                <p>In order to live our body needs energy. Energy comes with food and measured in calories. Only 3 nutrients can be converted to energy by our body: proteins, carbohydrates and fats.</p>
                <p>Our body needs the right amount of energy. If it gets too much - we gain weight. If it gets too little - we loose weight. How much energy we need to maintain a stable weight is determined by such factors as age, height, weight, gender and level of activity.</p>
                <p>All 3 nutrients perform their own functions in our body. Carbohydrates can be easily converted into evergy. That's why our body converts them first and if there is an excess - stores them in form of a fat.
                    Proteins are building blocks for our muscles. They can also be converted to energy but not as easy as carbohydrates. Fats are the hardest to convert to energy but they facilitate absorption of vitamins and micro elements.
            </p>
                <p>If you want to loose weight - consume less energy than you spend. If you want to gain weight in form of muscles - consume more proteins. And, of course, if you want to gain weight in form of fat - eat as much carbohydrates as you can :) (bad advice - don't listen to it).</p>
                <p>Ume will help you to track how much calories you consume as well as carbohydrates, proteins and fats. It will show you your personal daily norms and comsumption agains them. It will offer you a menu of popular Canadian restaurants to choose from. So, there is no need in reading menus and punching buttons on the calculator - just pick your favourite meal.</p>
            </div>
            <Link to="/login" className="Welcome-btn" >Login</Link>
            <Link to="/register" className="Welcome-btn" >Register</Link>
        </div>
    )
}

export default Welcome;