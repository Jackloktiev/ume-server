import React from 'react';
import "./mainContent.css";
import ChartBox from "../charts/chartBox";
import ChoiceBox from "../choice/choiceBox";
import Warning from "../charts/warning";
import Menu from "../menu/menu";

function mainContent(props) {
    let Charts = <ChartBox userData = {props.userData} />
    if(!props.normsSet){
        Charts = <Warning />
    }
    return (
        <div className="Main">
            <Menu/>
            {Charts}
            <ChoiceBox token = {props.token} setChartUpdate = {props.setChartUpdate} />
        </div>
    )
}

export default mainContent;