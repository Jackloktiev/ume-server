import React, {useState} from "react";
import "./mealChangeTile.css";

function MealChange(props) {
    const [quantity, setQuantity] = useState("");

    const title = props.data.name.charAt(0).toUpperCase() + props.data.name.slice(1);

    const quantityChangeHandler = (event)=>{
        setQuantity(event.target.value);
    }

    const cancelClickHandler = ()=>{
        props.setShow(false);
    }

    const changeClickHandler = ()=>{
        let ratio = quantity/props.data.amount;
        const formData={
            calories:props.data.calories*ratio,
            proteins:props.data.proteins*ratio,
            carbs:props.data.carbs*ratio,
            fats:props.data.fats*ratio,
            date:props.data.date,
            mealId:props.data.mealId,
            amount:quantity,
            name:props.data.name
        }
        fetch("/historyChange?token=" + window.sessionStorage.token,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(formData)
        }).then(response=>{
            return response.text();
        }).then(result=>{ props.setPageUpdate(props.pageUpdate + 1);
        }).then(props.setChartUpdate(Math.random()))
        props.setShow(false);
        setQuantity("");
    }

    let ChangeForm = "";
    if(props.show){
        ChangeForm = (
            <div className="Backdrop">
                <div className = "card text-white bg-primary mb-3 tile-form-consumed">
                    <h3 className="card-header">{title}</h3>
                    <div className="body-card flex-col">
                        <table className="table table-hover tile-table">
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
                                    <th><input type="number" name="quantity" value = {quantity} onChange = {quantityChangeHandler} className="form-control" /></th>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-1 change-meal-form-buttons">
                            <button className="btn btn-primary" onClick = {changeClickHandler}>Change</button>
                            <button className="btn btn-primary ml-3" onClick = {cancelClickHandler}>Cancel</button>
                        </div>
                    </div>
            </div>
        </div>
    );
    }
    
    
    
    return (
        <div>
            {ChangeForm}
        </div>
    )
}

export default MealChange;