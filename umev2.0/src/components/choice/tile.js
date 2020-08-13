import React from 'react';
import "./tile.css";



function Tile(props) {
    const clickHandler = ()=>{
        props.click(props.itemId);
    }
    const title = props.name.charAt(0).toUpperCase() + props.name.slice(1);
    return (
        <div className = "tile" onClick = {clickHandler}>
            <div className = "tileList">
                <img src = {props.imgUrl} alt={props.name} className = "tile-img" />
                <div>
                <h3>{title}</h3>
                <table>
                        <tbody>
                            <tr>
                                <th>Calories</th>
                                <th>{props.cal} cal</th>
                                <td></td>
                                <th>Fats</th>
                                <th>{props.fat} g</th>
                            </tr>
                            <tr>
                                <th>Carbs</th>
                                <th>{props.carbs} g</th>
                                <td></td>
                                <th>Proteins</th>
                                <th>{props.prot} g</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>
    )
};


export default Tile;