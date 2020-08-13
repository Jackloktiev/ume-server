import React, { useState, useEffect } from 'react';
import TileBox from "./tileBox";
import Search from "./search";
import "./choiceBox.css";
import RestPicker from "./restaurantPicker";



function ChoiceBox(props) {

    const [data, setData] = useState(); //save data on foods in a state so I can manipulate it in a search bar
    const [dataBackup, setDataBackup] = useState(); //second copy of data in order to accomodate deleting characters in the search bar
    const [searchLength, setSearchLength] = useState(0); // indicator for a search to switch between datasets. To accomodate deletion of charecters in the search bar

    const [listOfRestaurants,setListOfRestaurants] = useState([]); //list of restaurants for restaurant picker - needs to be a state in order to re-render picked once list is downloaded from the server
    const [currRest, setCurrRest] = useState(""); // indicator for restaurant picker to switch between datasets. To accomodate showing more estaurants than currently filtered

    //fetch data on food items and restaurants
    useEffect(() => {
        // food items
        fetch("/food", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => { return response.json() })
            .then((result) => {
                setData(result);
                setDataBackup(result);
            })

        // restaurants
        fetch("/restaurants", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => { return response.json() })
            .then((result) => {
                setListOfRestaurants(result);
            })
    }, [])

    const restaurantPickerHandler = (event) => {
        const dataCopy1 = [...data]; //not touching original state (make a shallow copy)
        const dataCopy2 = [...dataBackup]; //not touching original state (make a shallow copy)
        const currentOption = event.target.name;
        let filteredData = [];

        // there are 3 possible choices:
        // -all meals are shown
        // -restaurant changes
        // -restaurant doesn't chenge
        if (currentOption === "all") {
            filteredData = dataBackup;
        } else if (currentOption !== currRest) {
            filteredData = dataCopy2.filter(item => item.restaurant === currentOption);
            setCurrRest(currentOption);
        } else {
            filteredData = dataCopy1.filter(item => item.restaurant === currentOption);
            setCurrRest(currentOption);
        }
        setData(filteredData);
    }

    const SearchHandler = (event) => {
        const dataCopy1 = [...data]; //not touching original state (make a shallow copy)
        const dataCopy2 = [...dataBackup]; //not touching original state (make a shallow copy)
        const currentSearchWord = event.target.value;
        let filteredData = [];

        if (currentSearchWord.length > searchLength) {
            filteredData = dataCopy1.filter(item => item.name.includes(event.target.value));
            setSearchLength(currentSearchWord.length);
        } else {
            filteredData = dataCopy2.filter(item => item.name.includes(event.target.value));
            setSearchLength(currentSearchWord.length);
        }

        setData(filteredData);

    }


    return (
        <div className="choiceBox">
            <RestPicker data={listOfRestaurants} clickHandler={restaurantPickerHandler} />
            <Search changeHandler={SearchHandler} />
            {data && <TileBox data={data} token = {props.token} setChartUpdate = {props.setChartUpdate} />}
        </div>
    )
}

export default ChoiceBox;