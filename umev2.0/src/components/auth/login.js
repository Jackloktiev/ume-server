import React, { useState } from 'react';
import 'bootswatch/dist/yeti/bootstrap.min.css';
import "./login.css";
import { withRouter } from 'react-router-dom';

function Login(props) {

    const [userName, setUserName] = useState("");
    const [password,setPassword] = useState("");
    let [errorMessage,setErrorMessage] = useState("");


    //---Control form elements---
    //--User name--
    const userNameChangeHandler = (event)=>{
        setUserName(event.target.value);
    }
    //--Password--
    const passwordChangeHandler = (event)=>{
        setPassword(event.target.value);
    }
    //--Sign-in button click handler--
    const loginClickHandler = (event)=>{
        event.preventDefault();
        window.sessionStorage.clear();
        const formData = {
            username:userName,
            password:password
        }
        async function login(){
            let fetchData = await fetch("/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            });
            let response;
            if(fetchData.status===200){
                response = await fetchData.json();
            }else if(fetchData.status===401){
                //not autorized
                setErrorMessage(<div className = "Error"><p>Wrong password or username</p></div>);

            }else if(fetchData.status>=500){
                //server error
                setErrorMessage(<div className = "Error"><p>Server error. Try again later</p></div>);
            }else{
                //other error
                setErrorMessage(<div className = "Error"><p>Unknown error occured. Try again later</p></div>);
            }
            if(response){
                window.sessionStorage.setItem("token",response.token.token);
                window.sessionStorage.setItem("username",response.token.username);
                props.tokenTransfer(response.token);
                props.history.push("/app");
            }
        }
        login();
      }
    //Register button click handler
    const registerClickHandler = ()=>{
        props.history.push("/register");
    }

    return (


        <div>

            <div className="container mt-3">
                <form action="/login" method="POST" >
                    <fieldset>
                        <legend>Please sign in</legend>
                        <label className="col-form-label">User name</label>
                        <input type="text" placeholder="User name" className="form-control" name="username" onChange = {userNameChangeHandler} value = {userName} ></input>
                        <label className="col-form-label">Password</label>
                        <input type="password" placeholder="Password" className="form-control" name="password" onChange = {passwordChangeHandler} value = {password}  ></input>
                        {errorMessage}
                        <button type="submit" className="btn btn-primary mt-3 mr-3" onClick={loginClickHandler}>Sign in</button>

                        <button className="btn btn-primary mt-3" onClick = {registerClickHandler}>Register</button>
                    </fieldset>

                </form>
            </div>


        </div>
    )
}

export default withRouter(Login);