import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import Menu from "../menu/menu";
import 'bootswatch/dist/yeti/bootstrap.min.css';
import "./userProfile.css";

function UserProfile(props){

    const [name, setName] = useState(props.data.name||"");
    const [gender, setGender] = useState(props.data.gender||"female");
    const [age, setAge] = useState(props.data.age||"");
    const [height, setHeight] = useState(props.data.height||"");
    const [weight, setWeight] = useState(props.data.weight||"");
    const [activity, setActivity] = useState(props.data.levelOfActivity||"moderate");

    // Handle changes in form fields
    const changeHandler = (event)=>{
        switch(event.target.name){
            case "name": setName(event.target.value); 
            break;
            case "gender": setGender(event.target.value); 
            break;
            case "age": setAge(event.target.value); 
            break;
            case "height": setHeight(event.target.value); 
            break;
            case "weight": setWeight(event.target.value); 
            break;
            case "activity": setActivity(event.target.value); 
            break;
            default: break;

        }
        
    }
    // Submit button click
    const submitClickHandler = (event)=>{
        event.preventDefault();
        const data = {
            username:props.username,
            name:name,
            gender:gender,
            age:age,
            height:height,
            weight:weight,
            activity:activity
        }

        fetch("/setUserData",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }).then(response=>{
            return response.text();
        }).then(result=>{
            props.setChartUpdate(Math.random());
            props.history.push("/app");
        })
    }

    return(
       <div>
           <div className = "setUserData">
               <Menu/>
               <form action = "/userProfile" method = "POST" className="userdata-form">
                   <legend>We need your body parameters to define your consumption norms.</legend>
                   <label className="label">Gender:</label>
                   <select className = "form-control" name = "gender" value = {gender} onChange={changeHandler} >
                       <option value = "male" >Male</option>
                       <option value = "female" >Female</option>
                   </select>
                   <br></br>
                   <label className="label">Age in years:</label>
                   <input type = "text" className = "form-control" name = "age" value = {age} onChange={changeHandler} ></input>
                   <br></br>
                   <label className="label">Height in cm:</label>
                   <input type = "text" className = "form-control" name = "height" value = {height} onChange={changeHandler} ></input>
                   <br></br>
                   <label className="label">Weight in kg:</label>
                   <input type = "text" className = "form-control" name = "weight" value = {weight} onChange={changeHandler} ></input>
                   <br></br>
                   <label className="label">What is your level of activity:</label>
                   <select className = "form-control" name = "activity" value = {activity} onChange={changeHandler} >
                       <option value = "low" >Low</option>
                       <option value = "moderate" >Moderate</option>
                       <option value = "average" >Average</option>
                       <option value = "high" >High</option>
                       <option value = "sport" >Sport</option>
                   </select>
                   <br></br>
                   <button type = "submit" className = "btn btn-primary" onClick = {submitClickHandler} >Update profile</button>
               </form>
           </div>
       </div>
    )
}

export default withRouter(UserProfile);