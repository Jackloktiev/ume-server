import React from 'react';
import Chart from "./chart";
import "./chartBox.css";

function ChartBox(props) {
    return(
        <div className = "ChartBox">
            <Chart norm = {props.userData.normCarbs} consumption = {props.userData.totalCarbs} nutrient = "carbs" />
            <Chart norm = {props.userData.normProteins} consumption = {props.userData.totalProteins} nutrient = "proteins" />
            <Chart norm = {props.userData.normFats} consumption = {props.userData.totalFats} nutrient = "fats" />
            <Chart norm = {props.userData.normCalories} consumption = {props.userData.totalCalories} nutrient = "calories" />
        </div>
)}

export default ChartBox;