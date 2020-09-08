import React from 'react';
import 'bootswatch/dist/yeti/bootstrap.min.css';
import "./tile.css";



function Tile(props) {
    const clickHandler = ()=>{
        props.click(props.itemId);
    }
    const title = props.name.charAt(0).toUpperCase() + props.name.slice(1);
    let dots = "";
    if(title.length>22){
        dots="...";
    }
    return (
        <div className = "card text-white bg-primary mb-3 tile" onClick = {clickHandler}>
            <h3 className="card-header">{title.substr(0,22)+dots}</h3>
            <div className = "card-body body-card">
                <div className="tile-image-div" >
                    <img src = {props.imgUrl} alt={props.name} className = "tile-img" />
                </div>
                <div className="tile-table-container">
                    <table className="table table-hover tile-table">
                            <tbody>
                                <tr>
                                    <th>Calories</th>
                                    <th>{props.cal} cal</th>
                                    <td></td>
                                    <th>Fats</th>
                                    <th>{props.fat} g</th>
                                </tr>
                                <tr>
                                    <th scope="row">Carbs</th>
                                    <th scope="row">{props.carbs} g</th>
                                    <td></td>
                                    <th scope="row">Proteins</th>
                                    <th scope="row">{props.prot} g</th>
                                </tr>
                            </tbody>
                        </table>
                </div>
                
            </div>
        </div>
    )
};


export default Tile;