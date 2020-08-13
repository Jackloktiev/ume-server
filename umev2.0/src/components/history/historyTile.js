import React from 'react';
import "./historyTile.css";



function HistoryTile(props) {
    const deleteClickHandler = () => {
        props.deleteClickHandler(props.data.mealId);
    }
    const changeClickHandler = () => {
        props.changeClickHandler(props.data.mealId);
        props.setShow(true);
    }
    const title = props.data.name.charAt(0).toUpperCase() + props.data.name.slice(1);
    return (
        <div className="historyTile" >
            <div className="tileList">
                <div>
                    <h3>{title}</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>Calories total:</th>
                                <th>{props.data.calories.toFixed()} cal</th>
                                <td></td>
                                <th>Fats total:</th>
                                <th>{props.data.fats.toFixed()} g</th>
                            </tr>
                            <tr>
                                <th>Carbs total:</th>
                                <th>{props.data.carbs.toFixed()} g</th>
                                <td></td>
                                <th>Proteins total:</th>
                                <th>{props.data.proteins.toFixed()} g</th>
                            </tr>
                            <tr>
                                <th>Date:</th>
                                <th>{props.data.date}</th>
                                <td></td>
                                <th>Quantity consumed:</th>
                                <th>{props.data.amount} g</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button className="historyBtn" onClick = {changeClickHandler}>Change</button>
                <button className="historyBtn" onClick = {deleteClickHandler}>Delete</button>

            </div>
        </div>
    )
};


export default HistoryTile;