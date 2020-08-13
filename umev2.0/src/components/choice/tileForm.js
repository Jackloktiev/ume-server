import React, {useState} from "react";
import "./tileForm.css";

function TileForm(props){
    const [quantity, setQuantity] = useState("");
    const Now = new Date();
    const currDate = Now.getMonth() + "-" + Now.getDate() + "-" + Now.getFullYear(); //construct the data
    const title = props.data.name.charAt(0).toUpperCase() + props.data.name.slice(1);//capitalize the name of the food item
    
    const quantityChangeHandler = (event)=>{
        setQuantity(event.target.value);
    }
    const cancelClickHandler = ()=>{
        props.cancelClick();
    }
    const submitClickHandler = (event)=>{
        event.preventDefault();
        const formData={
            calories:props.data.caloriesPer100g,
            proteins:props.data.proteinsPer100g,
            carbs:props.data.carbsPer100g,
            fats:props.data.fatsPer100g,
            date:currDate,
            token:props.token,
            quantity:quantity,
            name:props.data.name
        }
        fetch("/consumed",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(formData)
        }).then(response=>{
            return response.text();
        }).then(result=>{
        }).then(()=>{props.setChartUpdate(Math.random())})
        props.cancelClick();
        setQuantity(0);
    }
    //show tileForm only if props.show === true
    let Content = null;
    if(props.show){
        Content = (
            <div className = "Backdrop">
                <div className = "tileForm">
                <img src={props.data.imageUrl} alt={props.data.name} className = "tileForm-img"/>
                <div>
                    <h3>{title}</h3>
                    <table>
                            <tbody>
                                <tr>
                                    <th>Calories</th>
                                    <th>{props.data.caloriesPer100g} cal</th>
                                    <td></td>
                                    <th>Fats</th>
                                    <th>{props.data.fatsPer100g} g</th>
                                </tr>
                                <tr>
                                    <th>Carbs</th>
                                    <th>{props.data.carbsPer100g} g</th>
                                    <td></td>
                                    <th>Proteins</th>
                                    <th>{props.data.proteinsPer100g} g</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <form action="/consumed" method="POST" className="tileForm">
                        <p>Amount of grams consumed:</p>
                        <input type="number" name="quantity" value = {quantity} onChange = {quantityChangeHandler} />
                        <input type="button" className="button" onClick = {submitClickHandler} value = "Submit" />
                        <input type="button" className="button" onClick = {cancelClickHandler} value = "Cancel" />
                    </form>
            </div>
        );
    }
    
    return (
        <div>
            {Content}
        </div>
    )
};

export default TileForm;