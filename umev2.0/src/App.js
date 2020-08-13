import React, { useEffect, useState } from 'react';
import './App.css';
import MainContent from "./components/containers/mainContent";
import Header from "./components/other/header";
import Footer from "./components/other/footer";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import UserProfile from "./components/auth/userprofile";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Welcome from "./components/welcome";
import History from "./components/history/history";


function App() {

  const [token,setToken] = useState(window.sessionStorage.token);
  //the app takes the value of a token from window.sessionStorage. This state is used to make fetch within useEffect run when new token is available.
  const getToken = (tokenValue)=>{
    setToken(tokenValue);
  };

  // Charts State
  const [chartUpdate, setChartUpdate] = useState(0);
  const [userData, setUserData] = useState({
    normCalories: 0,
    normFats: 0,
    normProteins: 0,
    normCarbs: 0,
    totalCarbs: 0,
    totalCalories: 0,
    totalFats: 0,
    totalProteins: 0
  });


  //Fetch userData from the server
  useEffect(() => {
      if(token){
        fetch("/userData?token=" + window.sessionStorage.token)
        .then(response => {
          return response.json();
        }).then(result => {
          setUserData(result);
        })
      }  
  }, [chartUpdate, token]);



  //If user profile is not completed yet - there are no norms and charts show the mess
  //If user profile is not completed instead of charts show prompt to complete the profile - normSet prop
  const MainScreen = <MainContent
                        userData={userData}
                        token={window.sessionStorage.token}
                        setChartUpdate={setChartUpdate}
                        normsSet = {userData.normCalories > 0.01? true: false}
                      /> 
  const LoginScreen = <Login tokenTransfer={getToken} /> // tokenTransfer={getToken}

  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="Chart">
          <Switch>
            <Route path="/" component={Welcome} exact />
            <Route path="/login" render={()=><Login tokenTransfer={getToken}/>} />
            <Route path="/user-profile" render={()=><UserProfile username = {window.sessionStorage.username} setChartUpdate = {setChartUpdate} data = {userData}/>}/>
            <Route path="/app" render={() => window.sessionStorage.token?MainScreen:LoginScreen} />
            <Route path="/register" component={Register} />
            <Route path="/history" render={()=><History setChartUpdate = {setChartUpdate} chartUpdate = {chartUpdate}/>} />
          </Switch>

        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
