import React, {useState} from 'react';
import Tile from "./tile";
import "./tileBox.css";
import TileForm from "./tileForm";



function ChoiceBox(props) {
    //variable for storing data for tileForm (pop-up form where user can submit the quantity of consumed product)
    let [itemData, setItemData] = useState({
        _id: "5e7685896bf8e61e745b0962",
        id: 3,
        category: "food",
        restaurant: "none",
        name: "apple",
        imageUrl: "https://images-na.ssl-images-amazon.com/images/I/71qw5OMSICL._AC_SX679_.jpg",
        caloriesPer100g: 43,
        fatsPer100g: 0,
        carbsPer100g: 11,
        proteinsPer100g: 0.4
    });
    let [show, setShow] = useState(false); //controls displaying of tileForm (pop-up form where user can submit the quantity of consumed product)
    
    //show tileForm when user clicks on food item
    const tileClickHandler = (itemId)=>{
        let item = props.data.find(
            function(element){
                return element.id === itemId;
            }
        )
        setItemData(item);
        setShow(true);
    }
    
    // hide tileForm when user clicks cancel button on it
    const cancelClickHandler = ()=>{
        setShow(false);
    }

    return (
        <div>
            <div className = "tileBox">
            {props.data.map(item=><Tile
                key = {item.id}
                itemId = {item.id}
                name={item.name}
                imgUrl={item.imageUrl}
                cal={item.caloriesPer100g}
                carbs={item.carbsPer100g}
                prot={item.proteinsPer100g}
                fat={item.fatsPer100g}
                token = {props.token}
                setChartUpdate = {props.setChartUpdate}
                click = {tileClickHandler}
            />)}
            </div>
            <TileForm 
                data = {itemData}
                token = {props.token}
                setChartUpdate = {props.setChartUpdate}
                show = {show}
                cancelClick = {cancelClickHandler}
            />
        </div>
        
    )
}

export default ChoiceBox;