import React, {useEffect,useState} from "react";
import "./history.css";
import Menu from "../menu/menu";
import HistoryTile from "./historyTile";
import MealChange from "./mealChangeTile";


const History = (props) => {
    const [meals, setMeals] = useState();
    const [deleteId, setDeleteId] = useState();
    const [changeId, setChangeId] = useState();
    const [pageUpdate, setPageUpdate] = useState(0);
    let [show, setShow] = useState(false);

    //fetch meal records from the server
    useEffect(() => {
        let getHistory = async()=>{
            let fetchData = await fetch("/history?token=" + window.sessionStorage.token);
            let result;
            if(fetchData.status===200){
                result = await fetchData.json();
            }
            if(result){
                setMeals(result);
            }else{
                setMeals([]);
            }
        }
        getHistory();
 
    },[pageUpdate]);

    //delete a particular meal
    useEffect(()=>{
        const data = {mealId:deleteId};
        fetch("/historyDelete?token=" + window.sessionStorage.token,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }).then(response=>{
            return response.text();
        }).then(result=>{
            setPageUpdate(pageUpdate+1);
        }).then(()=>{props.setChartUpdate(Math.random())})
    },[deleteId]);

    const deleteClickHandler = (mealId)=>{
        setDeleteId(mealId);
    }

    const changeClickHandler = (mealId)=>{
        setChangeId(mealId);
    }
    
    let Display;
    let MealChangeForm;
    let changeData;
    if(meals){
        if(meals.length >0){
            Display = (
                meals.map(meal=>{
                    return <HistoryTile key = {meal.mealId} data = {meal} deleteClickHandler = {deleteClickHandler} changeClickHandler = {changeClickHandler} setShow = {setShow}/>
                })
            );  
        }else{
            Display = <p>There are no meals data.</p>
        }

        if(changeId!==undefined){
            changeData = meals.find(meal=>{return meal.mealId===changeId});
            MealChangeForm = (<MealChange data = {changeData} show = {show} setShow = {setShow} pageUpdate = {pageUpdate} setPageUpdate={setPageUpdate} setChartUpdate = {props.setChartUpdate}/>);
        }else{
            MealChangeForm = "" 
        }


    }else{
        Display = <p>No content got from the server</p>
        MealChangeForm = ""
    }
    

    return (

        <div className="history">
            <Menu/>
            {Display}
            {MealChangeForm}
        </div>

    )
}
export default History;