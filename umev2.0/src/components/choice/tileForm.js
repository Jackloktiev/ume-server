import React, {useState} from "react";
import 'bootswatch/dist/yeti/bootstrap.min.css';
import "./tileForm.css";

function TileForm(props){
    const [quantity, setQuantity] = useState("");
    const Now = new Date();
    //const currDate = Now.getMonth() + "-" + Now.getDate() + "-" + Now.getFullYear(); //construct the date
    const currDate = Now.toISOString().substring(0,10); //construct the date
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
                <div className = "card text-white bg-primary mb-3 tile-form-consumed">
                    <h3 className="card-header">{title}</h3>
                    <div className="body-card-form">
                        <div className="tile-image-div-form" >
                            <img src={props.data.imageUrl} alt={props.data.name} className = "tile-img-form"/>
                        </div>
                        <div className="tile-table-container-form">
                            <table className="table table-hover tile-table-form">
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
                            <form action="/consumed" method="POST" className="consumed-form">
                                <p>Amount consumed:</p>
                                <input type="number" name="quantity" value = {quantity} onChange = {quantityChangeHandler} className="form-control" />
                                <input type="button" className="btn btn-primary mt-3" onClick = {submitClickHandler} value = "Submit" />
                                <input type="button" className="btn btn-primary ml-3 mt-3" onClick = {cancelClickHandler} value = "Cancel" />
                            </form>
                        </div>
                    </div>
                    
                </div>
                    
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