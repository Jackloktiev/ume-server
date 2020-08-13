import React, {useState} from 'react';
import "./login.css";
import { withRouter } from 'react-router-dom';



function Register(props){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let [errorMessage,setErrorMessage] = useState("");

    const changeHandler = (event)=>{

        switch(event.target.name){
            case "username": setUsername(event.target.value);
            break;
            case "password": setPassword(event.target.value);
            break;
            default: break;
        }
    }

    const submitClickHandler = (event) =>{
        event.preventDefault();
        window.sessionStorage.clear();
        const data = {
            username:username,
            password:password
        }
        async function register(){
            let fetchData = await fetch("/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })
            let response;
            if(fetchData.status===200){
                response = true;
            }else if(fetchData.status===409){
                //not autorized
                setErrorMessage(<div className = "Error"><p>User exists. Try different username</p></div>);
    
            }else if(fetchData.status>=500){
                //server error
                setErrorMessage(<div className = "Error"><p>Server error. Try again later</p></div>);
            }else{
                //other error
                setErrorMessage(<div className = "Error"><p>Unknown error occured. Try again later</p></div>);
            }
            if(response){
                props.history.push("/app");
            }
        }
        register();


    }


    return(
       <div>

           <div className = "LoginDiv">
               <form action = "/register" method = "POST" >
                   <h3>Let's sign you up!</h3>
                   <label>User name - something that you will be using to login</label>
                   <input type = "text" placeholder = "User name" className = "loginInput" name = "username" value = {username} onChange ={changeHandler} ></input>
                   <label>Password</label>
                   <input type = "password" placeholder = "Password" className = "loginInput" name = "password" value = {password} onChange ={changeHandler} ></input>
                   {errorMessage}
                   <button type = "submit" className = "loginBtn" onClick = {submitClickHandler} >Register</button>
               </form>
           </div>
           

       </div>
    )
}

export default withRouter(Register);